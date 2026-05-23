# Worker Wallet & Pay-Per-Offer System — Full-Stack Plan

## 1. Goal

Build a wallet-based monetization layer for **workers only**. The flow is:

1. Worker submits a price offer → fee is **automatically deducted** from their wallet.
2. On a successful deduction, the **full customer info** (name, phone, email, exact
   address with coordinates) becomes visible to the worker for that order.
3. The worker tops up their wallet **only via the admin** (no self top-up, no
   payment gateway in v1).
4. When the wallet balance is below the per-offer fee, the worker is **frozen**:
   - Can still **see** available orders and notifications.
   - Cannot **send** any new price offer.
   - Existing confirmed orders, chats, and offers remain accessible.

Customers and admins do **not** have wallets in this scope.

Stack:

- **Backend**: Laravel (matches existing API shapes — Laravel pagination,
  snake_case, ISO timestamps, `status/message/data` envelope).
- **Frontend**: Next.js 16 + React 19 + TypeScript (this repo).

---

## 2. Current state (what already exists)

### Backend (inferred from API shapes used by the frontend)

| Endpoint                       | Purpose                          |
| ------------------------------ | -------------------------------- |
| `POST /price-offers`           | Create a price offer             |
| `GET  /worker/orders`          | Available orders for the worker  |
| `GET  /worker/offers`          | Worker's pending offers          |
| `GET  /worker/offers/accepted` | Worker's accepted/confirmed list |
| `GET  /admin/worker`           | Worker management                |

### Frontend

| Concern              | File                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| Submit price offer   | [src/api/worker/priceOffer.ts](src/api/worker/priceOffer.ts), [src/hooks/worker/use-price-offer.ts](src/hooks/worker/use-price-offer.ts) |
| Price offer modal    | [src/components/worker/price-offer-modal.tsx](src/components/worker/price-offer-modal.tsx) |
| Worker order card    | [src/components/worker/worker-order-list-item.tsx](src/components/worker/worker-order-list-item.tsx) — already gates `canSendOffer` on `workerStatus === 'active'` |
| Worker status type   | [src/types/entities/worker.ts:12](src/types/entities/worker.ts#L12) — `'active' \| 'waiting' \| 'blocked'` |
| Customer info reveal | [src/components/worker/worker-confirmed-order-list-item.tsx](src/components/worker/worker-confirmed-order-list-item.tsx) (currently only after acceptance) |
| Admin worker mgmt    | [src/components/admin/modals/worker-requests-modal.tsx](src/components/admin/modals/worker-requests-modal.tsx) |
| Worker sidebar nav   | [src/components/worker/sidebar/use-worker-sidebar-state.ts](src/components/worker/sidebar/use-worker-sidebar-state.ts) |
| Shared HTTP helpers  | [src/api/admin/shared.ts](src/api/admin/shared.ts) |
| Hook utilities       | [src/hooks/admin/shared/use-fetch.ts](src/hooks/admin/shared/use-fetch.ts) — `useFetch`, `useMutation`, `generateRequestKey` |
| URL-routed modals    | [src/components/admin/modals/modal-controller.tsx](src/components/admin/modals/modal-controller.tsx) |

The frontend already has the right hook for the freeze gate: just add `'frozen'`
to `WorkerStatus` and combine it with a wallet balance check.

---

## 3. Domain model

### 3.1 Worker status — add a new value

`'frozen'` is **distinct from** `'blocked'`:

- `blocked` — admin-imposed ban; user cannot use the app at all.
- `frozen` — automatic; can browse orders but cannot submit offers. Lifts on top-up.

Final type: `'active' | 'waiting' | 'blocked' | 'frozen'`.

### 3.2 Charge timing — decision

The user requirement says "for each order he submits it successfully" and
"automatically shows the full customer info". We charge **on submit, atomic with
the offer create**:

- Pre-check `wallet.balance >= offer_fee`.
- Insufficient → 402, no offer row written, worker flagged `frozen`.
- Sufficient → write offer row + wallet debit txn in a single DB transaction,
  return offer + new balance + customer block.
- Customer rejection later → **no refund** in v1 (the fee buys access to the
  customer info, not the contract).

Alternative (charge on accept) was rejected because it both contradicts the
"automatically shows on submit" requirement and enables spam-submission abuse.

---

## 4. Backend (Laravel)

Suggested layout under `app/`:

```
app/
├── Models/
│   ├── WorkerWallet.php
│   ├── WalletTransaction.php
│   └── PlatformSetting.php
├── Services/
│   ├── WalletService.php          // balance reads, freeze/unfreeze logic
│   └── PriceOfferService.php      // atomic offer + fee deduction
├── Http/
│   ├── Controllers/
│   │   ├── Worker/
│   │   │   ├── WalletController.php
│   │   │   └── PriceOfferController.php    // existing — modify
│   │   └── Admin/
│   │       ├── WalletController.php
│   │       └── PlatformSettingController.php
│   ├── Requests/
│   │   ├── Worker/CreatePriceOfferRequest.php   // existing — extend
│   │   ├── Admin/TopUpWalletRequest.php
│   │   ├── Admin/AdjustWalletRequest.php
│   │   └── Admin/UpdatePlatformSettingRequest.php
│   └── Resources/
│       ├── WorkerWalletResource.php
│       ├── WalletTransactionResource.php
│       ├── PriceOfferWithCustomerResource.php
│       └── PlatformSettingResource.php
├── Exceptions/
│   ├── InsufficientWalletBalanceException.php
│   └── WalletFrozenException.php
├── Events/
│   ├── WalletToppedUp.php
│   └── WalletFrozen.php
└── Notifications/
    ├── WalletToppedUpNotification.php       // FCM (existing channel)
    └── WalletFrozenNotification.php
```

### 4.1 Migrations

`database/migrations/2026_05_24_000001_create_worker_wallets_table.php`

```php
Schema::create('worker_wallets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('worker_id')->unique()->constrained()->cascadeOnDelete();
    $table->decimal('balance', 12, 2)->default(0);
    $table->boolean('is_frozen')->default(true); // new workers start frozen
    $table->timestamp('last_topup_at')->nullable();
    $table->timestamps();
});
```

`2026_05_24_000002_create_wallet_transactions_table.php`

```php
Schema::create('wallet_transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('wallet_id')->constrained('worker_wallets')->cascadeOnDelete();
    $table->foreignId('worker_id')->constrained()->cascadeOnDelete();
    $table->enum('type', ['topup', 'offer_fee', 'refund', 'adjustment']);
    $table->decimal('amount', 12, 2);          // signed: + credit / − debit
    $table->decimal('balance_after', 12, 2);   // snapshot
    $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('offer_id')->nullable()->constrained('price_offers')->nullOnDelete();
    $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
    $table->text('note')->nullable();
    $table->timestamp('created_at')->useCurrent();
    $table->index(['worker_id', 'created_at']);
    $table->index(['type', 'created_at']);
});
```

`2026_05_24_000003_create_platform_settings_table.php`

```php
Schema::create('platform_settings', function (Blueprint $table) {
    $table->id();
    $table->decimal('offer_fee_amount', 12, 2)->default(5000);   // ل.س
    $table->decimal('freeze_threshold', 12, 2)->default(5000);
    $table->timestamps();
});
```

Seed one row. Cache it (`Cache::rememberForever`) and bust on update.

Optional `2026_05_24_000004_backfill_worker_wallets.php`: create a wallet row
for every existing worker.

### 4.2 Models

**`WorkerWallet`**

```php
class WorkerWallet extends Model
{
    protected $fillable = ['worker_id', 'balance', 'is_frozen', 'last_topup_at'];
    protected $casts = [
        'balance'       => 'decimal:2',
        'is_frozen'     => 'boolean',
        'last_topup_at' => 'datetime',
    ];

    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }
}
```

**`WalletTransaction`** — `$guarded = []`, casts `amount` and `balance_after` to
`decimal:2`, `belongsTo` `wallet`, `worker`, `order`, `offer`, `admin`.

**`PlatformSetting`** — single-row helper:

```php
public static function current(): self
{
    return Cache::rememberForever('platform_settings', fn () => self::firstOrFail());
}

protected static function booted(): void
{
    static::saved(fn () => Cache::forget('platform_settings'));
}
```

**Augment existing `Worker` model**:

```php
public function wallet(): HasOne
{
    return $this->hasOne(WorkerWallet::class);
}

public function walletOrCreate(): WorkerWallet
{
    return $this->wallet()->firstOrCreate(
        ['worker_id' => $this->id],
        ['balance' => 0, 'is_frozen' => true]
    );
}
```

Add `'frozen'` to whatever enum/cast guards `worker.status`.

### 4.3 Service layer

**`WalletService`** — keep state changes in one place so controllers stay thin.

```php
final class WalletService
{
    public function getOrCreate(Worker $worker): WorkerWallet
    {
        return $worker->walletOrCreate();
    }

    /** @throws InsufficientWalletBalanceException */
    public function debitForOffer(
        Worker $worker,
        PriceOffer $offer,
        float $amount,
    ): WalletTransaction {
        return DB::transaction(function () use ($worker, $offer, $amount) {
            // Pessimistic lock so two parallel requests can't double-spend.
            $wallet = $worker->wallet()->lockForUpdate()->first();

            if (! $wallet || (float) $wallet->balance < $amount) {
                $this->freeze($worker); // sets status + is_frozen
                throw new InsufficientWalletBalanceException();
            }

            $wallet->balance = bcsub($wallet->balance, $amount, 2);
            $wallet->is_frozen = (float) $wallet->balance < PlatformSetting::current()->freeze_threshold;
            $wallet->save();

            $txn = $wallet->transactions()->create([
                'worker_id'     => $worker->id,
                'type'          => 'offer_fee',
                'amount'        => -1 * $amount,
                'balance_after' => $wallet->balance,
                'order_id'      => $offer->order_id,
                'offer_id'      => $offer->id,
            ]);

            if ($wallet->is_frozen) {
                $this->freeze($worker);
            }

            return $txn;
        });
    }

    public function topUp(Worker $worker, float $amount, ?string $note, User $admin): WalletTransaction
    {
        return DB::transaction(function () use ($worker, $amount, $note, $admin) {
            $wallet = $worker->wallet()->lockForUpdate()->first()
                ?? $worker->walletOrCreate();

            $wallet->balance = bcadd($wallet->balance, $amount, 2);
            $wallet->last_topup_at = now();
            $wasFrozen = $wallet->is_frozen;
            $wallet->is_frozen = (float) $wallet->balance < PlatformSetting::current()->freeze_threshold;
            $wallet->save();

            $txn = $wallet->transactions()->create([
                'worker_id'     => $worker->id,
                'type'          => 'topup',
                'amount'        => $amount,
                'balance_after' => $wallet->balance,
                'admin_id'      => $admin->id,
                'note'          => $note,
            ]);

            if ($wasFrozen && ! $wallet->is_frozen) {
                $this->unfreeze($worker);
            }

            event(new WalletToppedUp($worker, $txn));

            return $txn;
        });
    }

    public function adjust(Worker $worker, float $signedAmount, string $note, User $admin): WalletTransaction
    {
        // Same pattern as topUp but allows negative amounts; note is required.
    }

    private function freeze(Worker $worker): void
    {
        if ($worker->status !== 'frozen' && $worker->status !== 'blocked') {
            $worker->update(['status' => 'frozen']);
            event(new WalletFrozen($worker));
        }
    }

    private function unfreeze(Worker $worker): void
    {
        if ($worker->status === 'frozen') {
            $worker->update(['status' => 'active']);
        }
    }
}
```

**`PriceOfferService`** orchestrates the atomic create:

```php
final class PriceOfferService
{
    public function __construct(private WalletService $wallet) {}

    public function create(Worker $worker, array $data): array
    {
        return DB::transaction(function () use ($worker, $data) {
            $order = Order::lockForUpdate()->findOrFail($data['order_id']);

            $offer = PriceOffer::create([
                'worker_id'  => $worker->id,
                'order_id'   => $order->id,
                'price'      => $data['price'],
                'time_range' => $data['time_range'],
                'status'     => 'pending',
            ]);

            $fee = (float) PlatformSetting::current()->offer_fee_amount;
            $this->wallet->debitForOffer($worker, $offer, $fee);

            return [
                'offer'    => $offer->fresh(),
                'wallet'   => $worker->wallet->fresh(['balance', 'is_frozen']),
                'customer' => $order->load('user', 'address.areaAddress'),
            ];
        });
    }
}
```

Wrap `InsufficientWalletBalanceException` in the controller, not the service.

### 4.4 Controllers

**Worker** — `routes/api.php` block (auth via existing `auth:sanctum` + `role:worker`):

```php
Route::middleware(['auth:sanctum', 'role:worker'])->group(function () {
    Route::get   ('/worker/wallet',              [WalletController::class, 'show']);
    Route::get   ('/worker/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post  ('/price-offers',               [PriceOfferController::class, 'store']);
});
```

`Worker\WalletController::show` returns `WorkerWalletResource` plus the
`offer_fee_amount` from `PlatformSetting::current()`.

`Worker\PriceOfferController::store`:

```php
public function store(CreatePriceOfferRequest $request, PriceOfferService $svc)
{
    try {
        $payload = $svc->create($request->user()->worker, $request->validated());
    } catch (InsufficientWalletBalanceException) {
        return response()->json([
            'status'  => false,
            'code'    => 'INSUFFICIENT_FUNDS',
            'message' => 'رصيد المحفظة غير كافٍ',
        ], 402);
    }

    return new PriceOfferWithCustomerResource($payload);
}
```

**Admin** — guarded by `role:admin`:

```php
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get  ('/wallets',                       [Admin\WalletController::class, 'index']);
    Route::get  ('/wallets/{worker}',              [Admin\WalletController::class, 'show']);
    Route::post ('/wallets/{worker}/topup',        [Admin\WalletController::class, 'topup']);
    Route::post ('/wallets/{worker}/adjust',       [Admin\WalletController::class, 'adjust']);
    Route::get  ('/wallet-transactions',           [Admin\WalletController::class, 'transactions']);
    Route::get  ('/platform-settings',             [Admin\PlatformSettingController::class, 'show']);
    Route::put  ('/platform-settings',             [Admin\PlatformSettingController::class, 'update']);
});
```

`Admin\WalletController::index` — paginated list of all wallets with worker
data, filterable by `frozen=true|false` and `q=` (worker name / phone search).

`topup` / `adjust` delegate to `WalletService` and return the new wallet state +
the txn.

### 4.5 Form requests

`CreatePriceOfferRequest` — existing, just verify rules:

```php
public function rules(): array
{
    return [
        'order_id'   => ['required', 'integer', 'exists:orders,id'],
        'price'      => ['required', 'numeric', 'gt:0'],
        'time_range' => ['required', 'string', 'min:2', 'max:200'],
    ];
}

public function authorize(): bool
{
    $worker = $this->user()?->worker;
    return $worker
        && $worker->status === 'active'
        // 'frozen' fails authorize → 403; "insufficient" is checked atomically inside the service.
        && PriceOffer::where('worker_id', $worker->id)
            ->where('order_id', $this->order_id)
            ->doesntExist();
}
```

`TopUpWalletRequest`:

```php
public function rules(): array
{
    return [
        'amount' => ['required', 'numeric', 'gt:0', 'max:100000000'],
        'note'   => ['nullable', 'string', 'max:500'],
    ];
}
```

`AdjustWalletRequest`:

```php
public function rules(): array
{
    return [
        'amount' => ['required', 'numeric', 'not_in:0'],   // signed
        'note'   => ['required', 'string', 'min:3', 'max:500'],
    ];
}
```

`UpdatePlatformSettingRequest`:

```php
public function rules(): array
{
    return [
        'offer_fee_amount' => ['required', 'numeric', 'gt:0'],
        'freeze_threshold' => ['required', 'numeric', 'gte:0'],
    ];
}
```

### 4.6 API resources

`WorkerWalletResource`:

```php
public function toArray($request): array
{
    return [
        'worker_id'        => $this->worker_id,
        'balance'          => (float) $this->balance,
        'is_frozen'        => (bool)  $this->is_frozen,
        'offer_fee_amount' => (float) PlatformSetting::current()->offer_fee_amount,
        'last_topup_at'    => $this->last_topup_at?->toIso8601String(),
        'updated_at'       => $this->updated_at->toIso8601String(),
    ];
}
```

`WalletTransactionResource` — flat shape mirroring §5.1 frontend types.

`PriceOfferWithCustomerResource` — wraps service output:

```php
public function toArray($request): array
{
    $offer    = $this['offer'];
    $wallet   = $this['wallet'];
    $customer = $this['customer'];

    return [
        'status'  => true,
        'message' => 'تم إرسال العرض وخصم رسوم المنصة',
        'data'    => [
            'offer'  => [
                'id'         => $offer->id,
                'order_id'   => $offer->order_id,
                'price'      => (float) $offer->price,
                'time_range' => $offer->time_range,
                'status'     => $offer->status,
            ],
            'wallet'   => [
                'balance'   => (float) $wallet->balance,
                'is_frozen' => (bool)  $wallet->is_frozen,
            ],
            'customer' => [
                'id'    => $customer->user->id,
                'name'  => $customer->user->name,
                'phone' => $customer->user->phone_number,
                'email' => $customer->user->email,
                'address' => [
                    'latitude'         => $customer->address->latitude,
                    'longitude'        => $customer->address->longitude,
                    'detailed_address' => $customer->address->detailed_address,
                    'area_name'        => $customer->address->areaAddress?->area_name,
                ],
            ],
        ],
    ];
}
```

### 4.7 Events & notifications

`WalletToppedUp` and `WalletFrozen` are dispatched from `WalletService`. Each
notification uses the existing FCM channel (the `fcm_token` is already on the
user — see `WorkerAcceptedOfferOrderUserBackend` in
[src/types/worker/orders-workflow.ts:68](src/types/worker/orders-workflow.ts#L68))
with payload `{ type: 'wallet_topup' | 'wallet_frozen', balance, ... }`.

### 4.8 Authorisation

- New `Gate::define('view-wallet', fn($user, $worker) => $user->id === $worker->user_id || $user->role === 'admin')`
- New `Gate::define('manage-wallets', fn($user) => $user->role === 'admin')`
- `Worker\PriceOfferController` relies on `CreatePriceOfferRequest::authorize`
  to enforce `worker.status === 'active'` and the no-duplicate-offer rule.

### 4.9 Tests

PHPUnit / Pest features (`tests/Feature/`):

- `WalletTopUpTest` — admin tops up; balance grows; `wallet_frozen` cleared if
  threshold crossed; transaction row written.
- `PriceOfferChargeTest`:
  - happy path: offer created, balance debited, customer block returned.
  - insufficient funds: 402 returned, no offer row, wallet flagged frozen,
    `WalletFrozen` event fired.
  - duplicate offer for same order: 403 (existing rule preserved).
  - race condition: two parallel POSTs to `/price-offers` for the same worker
    with balance for only one — exactly one succeeds (use database lock test).
- `WalletAdjustmentTest` — negative adjustment triggers freeze; positive lifts.
- `PlatformSettingTest` — cache busts on update.

---

## 5. Frontend (Next.js)

Follows the patterns in [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md):
modular API per domain, hooks with `useFetch` + `useMutation`, URL-routed
admin modals.

### 5.1 Types

**New** `src/types/entities/wallet.ts`:

```ts
export type WalletTransactionType =
  | 'topup'
  | 'offer_fee'
  | 'refund'
  | 'adjustment';

export interface WorkerWallet {
  worker_id: number;
  balance: number;
  is_frozen: boolean;
  offer_fee_amount: number;
  last_topup_at: string | null;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  type: WalletTransactionType;
  amount: number;          // signed
  balance_after: number;
  order_id: number | null;
  offer_id: number | null;
  admin_id: number | null;
  note: string | null;
  created_at: string;
}

export interface RevealedCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: {
    latitude: string;
    longitude: string;
    detailed_address: string;
    area_name: string;
  };
}

export interface CreatePriceOfferResult {
  offer: WorkerPriceOffer;
  wallet: Pick<WorkerWallet, 'balance' | 'is_frozen'>;
  customer: RevealedCustomer;
}

export interface PlatformSettings {
  offer_fee_amount: number;
  freeze_threshold: number;
}
```

Re-export from [src/types/entities/index.ts](src/types/entities/index.ts).

**Modify** [src/types/entities/worker.ts:12](src/types/entities/worker.ts#L12)
to add `'frozen'`.

**Modify** [src/types/entities/price-offer.ts](src/types/entities/price-offer.ts):
`CreateWorkerPriceOfferResponse.data` becomes `CreatePriceOfferResult`.

### 5.2 API layer

**New** `src/api/worker/wallet.ts`:

```ts
import { get } from '@/api/admin/shared';
import type { WorkerWallet, WalletTransaction } from '@/types/entities/wallet';

export const workerWalletApi = {
  getWallet: () =>
    get<{ data: WorkerWallet }>('/worker/wallet').then(r => r.data),
  getTransactions: (page = 1) =>
    get<{ data: WalletTransaction[]; meta: PaginationMeta }>(
      `/worker/wallet/transactions?page=${page}`
    ),
};
```

Register in [src/api/worker/index.ts](src/api/worker/index.ts).

**New** `src/api/admin/wallets.ts`:

```ts
export const adminWalletsApi = {
  getAll:          (filters) => get(`/admin/wallets${query(filters)}`),
  getOne:          (workerId) => get(`/admin/wallets/${workerId}`),
  topup:           (workerId, { amount, note }) =>
                     post(`/admin/wallets/${workerId}/topup`, { amount, note }),
  adjust:          (workerId, { amount, note }) =>
                     post(`/admin/wallets/${workerId}/adjust`, { amount, note }),
  getTransactions: (filters) => get(`/admin/wallet-transactions${query(filters)}`),
  getSettings:     () => get('/admin/platform-settings'),
  updateSettings:  (payload) => put('/admin/platform-settings', payload),
};
```

Register in [src/api/admin/index.ts](src/api/admin/index.ts).

### 5.3 Hooks

**`src/hooks/worker/use-worker-wallet.ts`** (new):

```ts
export function useWorkerWallet() {
  const fetcher = useCallback(() => workerWalletApi.getWallet(), []);
  const { data, isLoading, error, refetch, setData } =
    useFetch<WorkerWallet>(fetcher, generateRequestKey('worker-wallet'), {
      errorMessage: 'تعذر تحميل رصيد المحفظة',
    });
  return {
    wallet: data,
    isFrozen: data?.is_frozen ?? true,
    canSendOffer: !!data && !data.is_frozen,
    isLoading,
    error,
    refetch,
    applyChargeResult: (next: { balance: number; is_frozen: boolean }) =>
      setData(prev => (prev ? { ...prev, ...next } : prev)),
  };
}
```

**`src/hooks/worker/use-wallet-transactions.ts`** (new) — paginated ledger for
the worker.

**Modify** [src/hooks/worker/use-price-offer.ts](src/hooks/worker/use-price-offer.ts):

- Returned shape exposes `wallet` and `customer` from the response.
- On HTTP 402 (`INSUFFICIENT_FUNDS`) surface a custom Arabic toast and call the
  wallet's `refetch()` so the UI flips to frozen mode immediately.

**`src/hooks/admin/use-admin-wallets.ts`** (new) — list + filter.

**`src/hooks/admin/use-admin-wallet-mutations.ts`** (new) — `topup`, `adjust`,
optimistic update on the list row.

**`src/hooks/admin/use-platform-settings.ts`** (new) — read/update fee.

Export from each domain `index.ts`.

### 5.4 Worker UI

**Sidebar** — add a "المحفظة" entry in
[src/components/worker/sidebar/use-worker-sidebar-state.ts](src/components/worker/sidebar/use-worker-sidebar-state.ts):

```ts
{ href: '/worker/wallet', label: 'المحفظة', icon: Wallet },
```

**Dashboard hero** — extend
[src/components/worker/worker-dashboard-header.tsx](src/components/worker/worker-dashboard-header.tsx)
to render a balance chip and, when frozen, a rose-toned banner reading
`محفظتك فارغة — لا يمكنك إرسال عروض`.

**Order card** — extend
[src/components/worker/worker-order-list-item.tsx](src/components/worker/worker-order-list-item.tsx):

- Replace `workerStatus === 'active'` with
  `workerStatus === 'active' && !wallet.isFrozen` for `canSendOffer`.
- Helper text when disabled by freeze: `اشحن محفظتك لإرسال عروض جديدة`.

**Price offer modal** — extend
[src/components/worker/price-offer-modal.tsx](src/components/worker/price-offer-modal.tsx):

- Show a "رسوم المنصة" chip with the live `offer_fee_amount`.
- On success → swap body to a **customer-revealed pane** (name, phone, email,
  area, detailed address, small `MapPicker`). Reuse blocks from
  [src/components/worker/worker-confirmed-order-list-item.tsx](src/components/worker/worker-confirmed-order-list-item.tsx).
- On 402 → swap to an **empty-wallet pane** with CTA `تواصل مع الإدارة لشحن المحفظة`.

**Pending offers card** — extend
[src/components/worker/worker-pending-offer-list-item.tsx](src/components/worker/worker-pending-offer-list-item.tsx)
to surface customer name + phone (already paid for at submit time).

**New page** `src/app/worker/wallet/page.tsx` +
`src/components/worker/wallet/worker-wallet-page-content.tsx` containing:

- `wallet-balance-card.tsx`
- `wallet-frozen-banner.tsx`
- `wallet-transaction-row.tsx`
- `wallet-transactions-list.tsx` (paginated, RTL, type-coded badges).

### 5.5 Admin UI

**Register modal** in
[src/components/admin/modals/modal-controller.tsx](src/components/admin/modals/modal-controller.tsx):

```tsx
<WalletsModal open={modal === 'wallets'} />
```

Add quick action in [src/lib/admin/mock-data.ts](src/lib/admin/mock-data.ts):

```ts
{ label: 'محافظ العمال', modal: 'wallets', description: 'شحن وإدارة محافظ العمال' }
```

**`src/components/admin/modals/wallets-modal.tsx`** (new) — mirrors
[src/components/admin/modals/worker-requests-modal.tsx](src/components/admin/modals/worker-requests-modal.tsx):

- Status filter: `all | frozen | active`.
- Search bar (name / phone).
- Each row: worker name, balance, frozen badge, `شحن`, `سجل المعاملات`.

Sub-components in `src/components/admin/modals/wallets/`:

- `wallet-row.tsx`
- `topup-wallet-dialog.tsx`
- `adjust-wallet-dialog.tsx` (note required)
- `wallet-transactions-drawer.tsx`
- `use-admin-wallets.ts` (modal-local state, mirrors
  [src/components/admin/modals/worker-requests/use-worker-requests.ts](src/components/admin/modals/worker-requests/use-worker-requests.ts))

**Platform settings** — small section inside the wallets modal or a separate
`platform-settings` modal; confirmation dialog on save since it affects all workers.

---

## 6. End-to-end flows

### 6.1 Worker submits an offer — happy path

1. Worker clicks `إرسال عرض سعر`.
2. Modal opens with `رسوم المنصة: 5000 ل.س` chip from `useWorkerWallet`.
3. Worker fills price + time range → `إرسال العرض`.
4. Frontend → `POST /price-offers`.
5. Backend `PriceOfferService::create` runs in a single DB transaction:
   - Lock the wallet row.
   - Verify `balance >= fee`.
   - Insert offer.
   - Insert `wallet_transactions` debit.
   - Update `worker_wallets.balance` and `is_frozen`.
6. Response → `{ offer, wallet, customer }`.
7. Hook calls `wallet.applyChargeResult(response.wallet)`; order removed from
   the available list (existing logic).
8. Modal swaps to customer-revealed pane. Worker can copy phone, open Google
   Maps, etc.

### 6.2 Worker submits an offer — insufficient funds

1. Steps 1-4 as above.
2. Service throws `InsufficientWalletBalanceException`. Controller returns
   `402 { code: 'INSUFFICIENT_FUNDS' }`. Worker status flipped to `frozen` by
   `WalletService::freeze()`; `WalletFrozen` event fires (FCM optional).
3. Frontend hook surfaces Arabic toast and refetches the wallet.
4. Modal swaps to empty-wallet pane.
5. Order card buttons disable across the dashboard until top-up.

### 6.3 Admin tops up

1. Admin opens `لوحة التحكم` → `محافظ العمال`.
2. Selects worker → `شحن` → `TopUpWalletDialog`.
3. Enters amount + optional note → confirm.
4. `POST /admin/wallets/{worker}/topup` → `WalletService::topUp` runs in a
   single DB transaction with `lockForUpdate`.
5. If wallet was frozen and new balance ≥ threshold, worker status flips back
   to `active`; `WalletToppedUp` event fires (FCM optional).
6. Admin UI updates row optimistically. Toast: `تم شحن المحفظة بنجاح`.

### 6.4 Admin updates the per-offer fee

1. Open platform settings UI.
2. Enter new fee → confirmation dialog (`يؤثر على جميع العمال`).
3. `PUT /admin/platform-settings` → cache busted server-side.
4. Next worker submission charges the new fee.

---

## 7. UX rules (RTL Arabic)

Key strings (consistent with existing tone):

| Context                          | Arabic                                                |
| -------------------------------- | ----------------------------------------------------- |
| Wallet menu label                | المحفظة                                               |
| Fee chip in offer modal          | رسوم المنصة                                           |
| Submit success toast             | تم إرسال العرض وخصم رسوم المنصة                      |
| Insufficient funds toast         | رصيد المحفظة غير كافٍ. تواصل مع الإدارة لشحن المحفظة |
| Frozen banner                    | محفظتك فارغة — لا يمكنك إرسال عروض جديدة             |
| Disabled offer button helper     | اشحن محفظتك لإرسال عروض جديدة                        |
| Admin top-up dialog title        | شحن محفظة العامل                                     |
| Txn type: topup                  | شحن                                                  |
| Txn type: offer_fee              | رسوم عرض                                              |
| Txn type: refund                 | استرداد                                              |
| Txn type: adjustment             | تسوية يدوية                                          |
| Customer revealed pane title     | تم كشف بيانات العميل                                  |
| Customer revealed pane subtitle  | احتفظ بهذه البيانات للتواصل المباشر                   |

Currency suffix: `ل.س`, matching existing usage in
[src/components/worker/worker-pending-offer-list-item.tsx:84](src/components/worker/worker-pending-offer-list-item.tsx#L84).

---

## 8. Realtime (optional, v1.1)

The existing FCM infrastructure
([src/lib/notification-events.ts](src/lib/notification-events.ts)) carries:

- `wallet_topup` → frontend triggers `wallet.refetch()` + toast.
- `wallet_frozen` → frontend triggers `wallet.refetch()` + banner.

Server-side `WalletToppedUpNotification` / `WalletFrozenNotification` reuse the
existing FCM channel (same `fcm_token` already stored on `users`). Not required
for v1 — refetch on focus is acceptable.

---

## 9. Edge cases & decisions

| Case                                                  | Decision                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Offer + debit must be atomic                          | Single `DB::transaction` + `lockForUpdate` on the wallet row.            |
| Two parallel offer submissions                        | Pessimistic lock blocks the second until the first commits.              |
| Admin tops up with negative amount                    | `TopUpWalletRequest` rejects (`gt:0`). Use `adjust` endpoint with note.  |
| Customer cancels after fee was charged                | No refund in v1. `refund` type kept on the enum for future.              |
| Worker is `blocked` and wallet has balance            | `blocked` wins. `authorize()` on the request blocks submission.          |
| Two devices, same worker                              | Server is the source of truth; refetch-on-focus is enough.               |
| Fee changes mid-session                               | Server uses live fee at submit time; client modal updates on next open.  |
| Worker views already-offered order                    | Customer info shown in `/worker/offers` list (fee already paid).         |
| Admin deletes a worker                                | Wallet kept with `cascadeOnDelete` for audit (or use `restrictOnDelete` if you want hard retention). |
| New worker created without a wallet row               | `walletOrCreate()` runs on first `GET /worker/wallet`; backfill migration covers the rest. |

---

## 10. File-level change list

### Backend (Laravel)

**New**

- `database/migrations/2026_05_24_000001_create_worker_wallets_table.php`
- `database/migrations/2026_05_24_000002_create_wallet_transactions_table.php`
- `database/migrations/2026_05_24_000003_create_platform_settings_table.php`
- `database/migrations/2026_05_24_000004_backfill_worker_wallets.php`
- `database/seeders/PlatformSettingSeeder.php`
- `app/Models/WorkerWallet.php`
- `app/Models/WalletTransaction.php`
- `app/Models/PlatformSetting.php`
- `app/Services/WalletService.php`
- `app/Services/PriceOfferService.php`
- `app/Http/Controllers/Worker/WalletController.php`
- `app/Http/Controllers/Admin/WalletController.php`
- `app/Http/Controllers/Admin/PlatformSettingController.php`
- `app/Http/Requests/Admin/TopUpWalletRequest.php`
- `app/Http/Requests/Admin/AdjustWalletRequest.php`
- `app/Http/Requests/Admin/UpdatePlatformSettingRequest.php`
- `app/Http/Resources/WorkerWalletResource.php`
- `app/Http/Resources/WalletTransactionResource.php`
- `app/Http/Resources/PriceOfferWithCustomerResource.php`
- `app/Http/Resources/PlatformSettingResource.php`
- `app/Exceptions/InsufficientWalletBalanceException.php`
- `app/Exceptions/WalletFrozenException.php`
- `app/Events/WalletToppedUp.php`
- `app/Events/WalletFrozen.php`
- `app/Notifications/WalletToppedUpNotification.php`
- `app/Notifications/WalletFrozenNotification.php`
- `tests/Feature/Wallet/WalletTopUpTest.php`
- `tests/Feature/Wallet/PriceOfferChargeTest.php`
- `tests/Feature/Wallet/WalletAdjustmentTest.php`
- `tests/Feature/Wallet/PlatformSettingTest.php`

**Modified**

- `app/Models/Worker.php` — add `wallet()`, `walletOrCreate()`; allow `'frozen'` status.
- `app/Http/Controllers/Worker/PriceOfferController.php` — delegate to `PriceOfferService`, handle insufficient-funds 402.
- `app/Http/Requests/Worker/CreatePriceOfferRequest.php` — block `'frozen'` status in `authorize()`.
- `routes/api.php` — wallet + platform-settings routes.
- `database/factories/WorkerFactory.php` — create a wallet alongside.

### Frontend (Next.js)

**New**

- `src/types/entities/wallet.ts`
- `src/api/worker/wallet.ts`
- `src/api/admin/wallets.ts`
- `src/hooks/worker/use-worker-wallet.ts`
- `src/hooks/worker/use-wallet-transactions.ts`
- `src/hooks/admin/use-admin-wallets.ts`
- `src/hooks/admin/use-admin-wallet-mutations.ts`
- `src/hooks/admin/use-platform-settings.ts`
- `src/app/worker/wallet/page.tsx`
- `src/components/worker/wallet/worker-wallet-page-content.tsx`
- `src/components/worker/wallet/wallet-balance-card.tsx`
- `src/components/worker/wallet/wallet-frozen-banner.tsx`
- `src/components/worker/wallet/wallet-transaction-row.tsx`
- `src/components/worker/wallet/wallet-transactions-list.tsx`
- `src/components/admin/modals/wallets-modal.tsx`
- `src/components/admin/modals/wallets/wallet-row.tsx`
- `src/components/admin/modals/wallets/topup-wallet-dialog.tsx`
- `src/components/admin/modals/wallets/adjust-wallet-dialog.tsx`
- `src/components/admin/modals/wallets/wallet-transactions-drawer.tsx`
- `src/components/admin/modals/wallets/use-admin-wallets.ts`

**Modified**

- [src/types/entities/worker.ts](src/types/entities/worker.ts) — add `'frozen'` to `WorkerStatus`.
- [src/types/entities/price-offer.ts](src/types/entities/price-offer.ts) — extend `CreateWorkerPriceOfferResponse.data` to include `wallet` and `customer`.
- [src/types/entities/index.ts](src/types/entities/index.ts) — export wallet types.
- [src/hooks/worker/use-price-offer.ts](src/hooks/worker/use-price-offer.ts) — surface new response payload + 402 handling.
- [src/hooks/worker/index.ts](src/hooks/worker/index.ts) — export wallet hooks.
- [src/api/worker/index.ts](src/api/worker/index.ts) — export `workerWalletApi`.
- [src/api/admin/index.ts](src/api/admin/index.ts) — export `adminWalletsApi`.
- [src/hooks/admin/index.ts](src/hooks/admin/index.ts) — export admin hooks.
- [src/components/worker/sidebar/use-worker-sidebar-state.ts](src/components/worker/sidebar/use-worker-sidebar-state.ts) — wallet nav link.
- [src/components/worker/worker-dashboard-header.tsx](src/components/worker/worker-dashboard-header.tsx) — balance chip + frozen banner.
- [src/components/worker/worker-order-list-item.tsx](src/components/worker/worker-order-list-item.tsx) — combine frozen check into `canSendOffer`.
- [src/components/worker/worker-dashboard-page-content.tsx](src/components/worker/worker-dashboard-page-content.tsx) — wire `useWorkerWallet`.
- [src/components/worker/price-offer-modal.tsx](src/components/worker/price-offer-modal.tsx) — fee chip + post-submit reveal/empty-wallet panes.
- [src/components/worker/worker-pending-offer-list-item.tsx](src/components/worker/worker-pending-offer-list-item.tsx) — show revealed customer phone + name.
- [src/components/admin/modals/modal-controller.tsx](src/components/admin/modals/modal-controller.tsx) — register `WalletsModal`.
- [src/lib/admin/mock-data.ts](src/lib/admin/mock-data.ts) — add `محافظ العمال` quick action.

---

## 11. Implementation milestones

Suggested sequence — each milestone is independently shippable.

**M1 — Backend foundation** (1.5 days)
Migrations, models, `PlatformSetting` cache, `WalletService` skeleton, factory
updates, backfill of existing workers.

**M2 — Backend pay-on-submit + reveal** (2 days)
`PriceOfferService`, controller changes, `PriceOfferWithCustomerResource`, the
402 path, `WalletFrozen` event, feature tests.

**M3 — Backend admin endpoints** (1.5 days)
`Admin\WalletController`, top-up / adjust requests + tests,
`PlatformSettingController` with cache busting.

**M4 — Frontend types & API contracts** (0.5 day)
Wallet types, `'frozen'` status, API modules. Hooks can ship with mocked data
if backend lags.

**M5 — Frontend worker wallet page & sidebar** (1 day)
`/worker/wallet`, balance card, transactions list, sidebar nav.

**M6 — Frontend charge-on-submit + customer reveal** (1.5 days)
Update `usePriceOffer`, swap modal body to reveal/empty panes, extend pending
offers card.

**M7 — Frontend freeze enforcement** (0.5 day)
Combine `frozen` into `canSendOffer`, hero banner.

**M8 — Frontend admin wallets modal** (2 days)
Modal + filters + dialogs + transactions drawer.

**M9 — Platform settings UI** (0.5 day)
Edit fee from admin with confirm dialog.

**M10 — Realtime + polish** (1 day)
Optional FCM events, empty states, loading skeletons, Arabic copy review,
RTL spot-check on mobile.

**Total estimate**: ~5 backend days + ~7 frontend days, parallelisable.

---

## 12. Out of scope (v1 non-goals)

- Self-service top-up via payment gateway.
- Refunds on customer rejection.
- Per-career or per-region fee tiers.
- Worker-to-worker transfers.
- Customer or admin wallets.
- Multi-currency.

These layer on later without restructuring the ledger model.
