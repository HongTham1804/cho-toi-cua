<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! $this->hasIndex('products', 'products_store_category_status_stock_idx')) {
            Schema::table('products', function (Blueprint $table) {
                $table->index(['store_id', 'category_id', 'is_active', 'stock'], 'products_store_category_status_stock_idx');
            });
        }

        if (! $this->hasForeignKey('products', 'products_store_id_fk')) {
            Schema::table('products', function (Blueprint $table) {
                $table->foreign('store_id', 'products_store_id_fk')
                    ->references('id')
                    ->on('stores')
                    ->cascadeOnDelete();
            });
        }

        foreach ([
            'orders_customer_status_idx' => ['customer_id', 'status'],
            'orders_store_status_idx' => ['store_id', 'status'],
            'orders_shipper_status_idx' => ['shipper_id', 'status'],
            'orders_voucher_id_idx' => ['voucher_id'],
        ] as $indexName => $columns) {
            if (! $this->hasIndex('orders', $indexName)) {
                Schema::table('orders', function (Blueprint $table) use ($columns, $indexName) {
                    $table->index($columns, $indexName);
                });
            }
        }

        foreach ([
            'orders_store_id_fk' => ['store_id', 'stores', 'restrict'],
            'orders_shipper_id_fk' => ['shipper_id', 'shippers', 'null'],
            'orders_voucher_id_fk' => ['voucher_id', 'vouchers', 'null'],
        ] as $foreignName => [$column, $referencedTable, $deleteRule]) {
            if (! $this->hasForeignKey('orders', $foreignName)) {
                Schema::table('orders', function (Blueprint $table) use ($column, $referencedTable, $foreignName, $deleteRule) {
                    $foreign = $table->foreign($column, $foreignName)
                        ->references('id')
                        ->on($referencedTable);

                    $deleteRule === 'null'
                        ? $foreign->nullOnDelete()
                        : $foreign->restrictOnDelete();
                });
            }
        }

        Schema::table('order_details', function (Blueprint $table) {
            $table->unsignedBigInteger('product_id')->nullable()->change();
        });

        DB::statement('UPDATE order_details od LEFT JOIN products p ON od.product_id = p.id SET od.product_id = NULL WHERE p.id IS NULL');

        if (! $this->hasIndex('order_details', 'order_details_product_id_idx')) {
            Schema::table('order_details', function (Blueprint $table) {
                $table->index('product_id', 'order_details_product_id_idx');
            });
        }

        if (! $this->hasForeignKey('order_details', 'order_details_product_id_fk')) {
            Schema::table('order_details', function (Blueprint $table) {
                $table->foreign('product_id', 'order_details_product_id_fk')
                    ->references('id')
                    ->on('products')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if ($this->hasForeignKey('order_details', 'order_details_product_id_fk')) {
            Schema::table('order_details', fn (Blueprint $table) => $table->dropForeign('order_details_product_id_fk'));
        }

        if ($this->hasIndex('order_details', 'order_details_product_id_idx')) {
            Schema::table('order_details', fn (Blueprint $table) => $table->dropIndex('order_details_product_id_idx'));
        }

        foreach (['orders_voucher_id_fk', 'orders_shipper_id_fk', 'orders_store_id_fk'] as $foreignName) {
            if ($this->hasForeignKey('orders', $foreignName)) {
                Schema::table('orders', fn (Blueprint $table) => $table->dropForeign($foreignName));
            }
        }

        foreach (['orders_voucher_id_idx', 'orders_shipper_status_idx', 'orders_store_status_idx', 'orders_customer_status_idx'] as $indexName) {
            if ($this->hasIndex('orders', $indexName)) {
                Schema::table('orders', fn (Blueprint $table) => $table->dropIndex($indexName));
            }
        }

        if ($this->hasForeignKey('products', 'products_store_id_fk')) {
            Schema::table('products', fn (Blueprint $table) => $table->dropForeign('products_store_id_fk'));
        }

        if ($this->hasIndex('products', 'products_store_category_status_stock_idx')) {
            Schema::table('products', fn (Blueprint $table) => $table->dropIndex('products_store_category_status_stock_idx'));
        }
    }

    private function hasForeignKey(string $table, string $name): bool
    {
        return DB::table('information_schema.TABLE_CONSTRAINTS')
            ->where('CONSTRAINT_SCHEMA', DB::getDatabaseName())
            ->where('TABLE_NAME', $table)
            ->where('CONSTRAINT_NAME', $name)
            ->where('CONSTRAINT_TYPE', 'FOREIGN KEY')
            ->exists();
    }

    private function hasIndex(string $table, string $name): bool
    {
        return DB::table('information_schema.STATISTICS')
            ->where('TABLE_SCHEMA', DB::getDatabaseName())
            ->where('TABLE_NAME', $table)
            ->where('INDEX_NAME', $name)
            ->exists();
    }
};
