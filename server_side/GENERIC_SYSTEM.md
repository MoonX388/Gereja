# 🚀 Generic System Documentation

Sistem generic yang memungkinkan Anda menghubungkan tabel-tabel database tanpa perlu menulis manual interfaces dan entities. Sistem ini menggunakan Supabase Client secara langsung dengan pendekatan yang dinamis dan fleksibel.

## 📋 Fitur Utama

✅ **Tanpa Entity/Interface Manual** - Tidak perlu membuat TypeScript entities atau interfaces
✅ **Relasi Otomatis** - Hubungkan tabel dengan mudah menggunakan query parameters
✅ **CRUD Otomatis** - Semua operasi dasar tersedia secara otomatis
✅ **Filter Dinamis** - Filter data dengan berbagai operator (eq, neq, gt, lt, like, dll)
✅ **Pagination** - Dukungan pagination built-in
✅ **Search** - Fitur pencarian multi-field
✅ **Bulk Operations** - Operasi massal (create, update, delete)
✅ **Konversi Otomatis** - Otomatis konversi camelCase ↔ snake_case

## 🏗️ Arsitektur

```
src/common/base/
├── generic-repository.ts    # Base class untuk operasi database
├── generic-service.ts       # Base class untuk logika bisnis
└── generic-controller.ts    # Base class untuk REST endpoints
```

## 📖 Cara Penggunaan

### 1. Membuat Service Baru

Buat service yang extends `GenericService`:

```typescript
import { Injectable } from '@nestjs/common';
import { GenericService, ServiceConfig } from '../common/base/generic-service';
import { GenericRepository } from '../common/base/generic-repository';

@Injectable()
export class NamaTableService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'nama_tabel_di_database',  // Nama tabel di Supabase
      defaultSelect: '*',                   // Default select columns
      defaultRelations: ['tabel_relasi']    // Default relasi yang sering digunakan
    });
  }

  // Tambahkan method khusus jika diperlukan
  async findByCustomField(value: string) {
    return this.findMany({ custom_field: value });
  }
}
```

### 2. Membuat Controller Baru

Buat controller yang extends `GenericController`:

```typescript
import { Controller } from '@nestjs/common';
import { GenericController, ControllerConfig } from '../common/base/generic-controller';
import { NamaTableService } from './nama-table.service';

@Controller('nama-tabel')
export class NamaTableController extends GenericController {
  constructor(service: NamaTableService) {
    super(service, {
      path: 'nama-tabel',
      resourceName: 'NamaTable'
    });
  }

  // Override atau tambahkan endpoint khusus jika diperlukan
  // Semua endpoint CRUD dasar sudah otomatis tersedia
}
```

### 3. Membuat Module

```typescript
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { NamaTableService } from './nama-table.service';
import { NamaTableController } from './nama-table.controller';

@Module({
  imports: [CommonModule],
  controllers: [NamaTableController],
  providers: [NamaTableService],
  exports: [NamaTableService],
})
export class NamaTableModule {}
```

### 4. Daftarkan di AppModule

```typescript
import { NamaTableModule } from './nama-table/nama-table.module';

@Module({
  imports: [
    // ... other imports
    NamaTableModule,
  ],
})
export class AppModule {}
```

## 🎯 Endpoint Otomatis

Setiap controller yang extends `GenericController` otomatis memiliki endpoint berikut:

### GET `/nama-tabel`
Get all records dengan opsional filter, pagination, dan relasi.

**Query Parameters:**
- `filters` (JSON string): Filter conditions
- `select`: Kolom yang ingin di-select
- `relations`: Relasi yang ingin di-load (comma separated)
- `orderBy`: Ordering (column,asc atau column,desc)
- `limit`: Limit records
- `offset`: Offset records
- `page`: Page number (jika paginate=true)
- `paginate`: Boolean untuk pagination

**Example:**
```
GET /users?filters={"role":"admin"}&relations=jemaat&orderBy=id,asc&limit=10
```

### GET `/nama-tabel/:id`
Get single record by ID.

**Query Parameters:**
- `select`: Kolom yang ingin di-select
- `relations`: Relasi yang ingin di-load

**Example:**
```
GET /users/123?relations=jemaat,pelayan
```

### POST `/nama-tabel`
Create new record.

**Body:** Data object untuk create

**Example:**
```json
POST /users
{
  "email": "user@example.com",
  "username": "user123",
  "role": "admin"
}
```

### POST `/nama-tabel/bulk`
Create multiple records.

**Body:** Array of data objects

**Example:**
```json
POST /users/bulk
[
  {"email": "user1@example.com", "username": "user1"},
  {"email": "user2@example.com", "username": "user2"}
]
```

### PUT `/nama-tabel/:id`
Update record by ID.

**Body:** Data object untuk update

**Example:**
```json
PUT /users/123
{
  "role": "superadmin"
}
```

### PUT `/nama-tabel/bulk/update`
Update multiple records by filters.

**Query Parameters:**
- `filters` (JSON string): Filter conditions

**Body:** Data object untuk update

**Example:**
```
PUT /users/bulk/update?filters={"role":"admin"}
{
  "status": "active"
}
```

### DELETE `/nama-tabel/:id`
Delete record by ID.

### DELETE `/nama-tabel/bulk`
Delete multiple records by filters.

**Query Parameters:**
- `filters` (JSON string): Filter conditions

**Example:**
```
DELETE /users/bulk?filters={"status":"inactive"}
```

### GET `/nama-tabel/count/count`
Count records by filters.

**Query Parameters:**
- `filters` (JSON string): Filter conditions

**Example:**
```
GET /users/count/count?filters={"role":"admin"}
```

### GET `/nama-tabel/search/search`
Search records across multiple fields.

**Query Parameters:**
- `q`: Search term
- `fields`: Fields to search (comma separated)
- `select`: Kolom yang ingin di-select
- `relations`: Relasi yang ingin di-load

**Example:**
```
GET /users/search/search?q=john&fields=email,username
```

### POST `/nama-tabel/upsert`
Create or update record based on filters.

**Query Parameters:**
- `filters` (JSON string): Filter conditions untuk mencari existing record

**Body:** Data object untuk create/update

**Example:**
```
POST /users/upsert?filters={"email":"user@example.com"}
{
  "username": "updated_username"
}
```

### POST `/nama-tabel/bulk/operations`
Execute multiple operations in one request.

**Body:** Array of operations

**Example:**
```json
POST /users/bulk/operations
[
  {"type": "create", "data": {"email": "new@example.com"}},
  {"type": "update", "id": 123, "data": {"role": "admin"}},
  {"type": "delete", "id": 456}
]
```

### GET `/nama-tabel/related/:foreignKey/:foreignKeyValue`
Get records by foreign key.

**Example:**
```
GET /jemaat/related/user_id/123
```

### GET `/nama-tabel/with-relation/:relationTable`
Get records with specific relation.

**Query Parameters:**
- `foreignKey`: Foreign key column name
- `filters`: Filter conditions
- `select`: Kolom yang ingin di-select

**Example:**
```
GET /users/with-relation/jemaat?foreignKey=user_id
```

## 🔍 Filter Dinamis

Gunakan operator khusus dalam filter JSON:

```json
{
  "field": "value",              // Equality
  "field": { "eq": "value" },    // Equal
  "field": { "neq": "value" },   // Not equal
  "field": { "gt": 10 },         // Greater than
  "field": { "gte": 10 },        // Greater than or equal
  "field": { "lt": 10 },         // Less than
  "field": { "lte": 10 },        // Less than or equal
  "field": { "like": "%value%" },// Like
  "field": { "ilike": "%value%" },// Case-insensitive like
  "field": { "in": [1,2,3] },    // In array
  "field": { "is": null }        // Is null
}
```

**Example Complex Filter:**
```json
{
  "role": "admin",
  "status": { "neq": "deleted" },
  "created_at": { "gte": "2024-01-01" }
}
```

## 🔗 Relasi Antar Tabel

Ada beberapa cara untuk menghubungkan tabel:

### 1. Melalui Query Parameter `relations`

```
GET /users?relations=jemaat,pelayan
```

### 2. Melalui Service Method

```typescript
async getUserWithJemaat(userId: string) {
  return this.findById(userId, { relations: ['jemaat'] });
}
```

### 3. Melalui Generic Repository

```typescript
async withRelation() {
  return this.repository.withRelation<User, Jemaat>(
    'user',
    'jemaat',
    'user_id',
    { filters: { role: 'admin' } }
  );
}
```

## 📝 Contoh Implementasi Lengkap

### Contoh 1: Tabel Jemaat

```typescript
// jemaat-generic.service.ts
@Injectable()
export class JemaatGenericService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'jemaat',
      defaultSelect: '*',
      defaultRelations: ['user', 'keluarga']
    });
  }

  async findByStatus(status: string) {
    return this.findMany({ status });
  }
}

// jemaat-generic.controller.ts
@Controller('jemaat')
export class JemaatGenericController extends GenericController {
  constructor(service: JemaatGenericService) {
    super(service, { path: 'jemaat', resourceName: 'Jemaat' });
  }
}
```

### Contoh 2: Tabel Users dengan Permissions

```typescript
// users-generic.service.ts
@Injectable()
export class UsersGenericService extends GenericService {
  constructor(repository: GenericRepository) {
    super(repository, {
      tableName: 'user',
      defaultSelect: '*',
      defaultRelations: ['jemaat', 'pelayan']
    });
  }

  async updatePermissions(userId: string, permissions: string[]) {
    return this.update(userId, { permissions });
  }

  async hasPermission(userId: string, permission: string) {
    const user = await this.findById(userId);
    const permissions = Array.isArray(user.permissions) 
      ? user.permissions 
      : JSON.parse(user.permissions);
    return permissions.includes(permission);
  }
}
```

## 🎨 Method Tambahan di GenericService

Selain CRUD dasar, `GenericService` juga menyediakan:

- `findOneOrNull(filters)` - Cari satu record tanpa throw exception
- `findMany(filters)` - Cari multiple records
- `upsert(filters, data)` - Create atau update
- `bulkOperation(operations)` - Operasi massal
- `search(searchTerm, searchFields)` - Pencarian multi-field
- `getRelatedByForeignKey(foreignKey, foreignKeyValue)` - Get by foreign key
- `withRelation(relationTable, foreignKey)` - Get dengan relasi
- `transaction(operations)` - Operasi transaction-like

## 🚨 Catatan Penting

1. **Nama Tabel**: Gunakan nama tabel yang sesuai dengan di database Supabase
2. **Konversi Nama**: Sistem otomatis mengkonversi camelCase ↔ snake_case
3. **Relasi**: Pastikan foreign key sudah di-setup dengan benar di database
4. **Error Handling**: Semua error sudah di-handle dengan pesan yang jelas
5. **Type Safety**: Untuk type safety yang lebih baik, Anda bisa tambahkan TypeScript interfaces manual jika diperlukan

## 🔧 Migration dari Sistem Lama

Untuk migrasi dari sistem lama (dengan entity/interface):

1. Buat generic service untuk tabel yang ingin di-migrate
2. Buat generic controller 
3. Update module untuk menggunakan generic system
4. Test endpoint baru
5. Update frontend untuk menggunakan endpoint baru
6. Hapus entity/interface lama jika tidak diperlukan lagi

## 📚 Referensi

- Supabase JS Client: https://supabase.com/docs/reference/javascript
- NestJS Documentation: https://docs.nestjs.com
- Generic System Implementation: `src/common/base/`
