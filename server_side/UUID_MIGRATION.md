# 🔄 UUID Migration Documentation

Dokumentasi lengkap untuk migrasi seluruh sistem dari Integer ID ke UUID.

## 📋 Perubahan yang Dilakukan

### 1. **Generic Repository** (`src/common/base/generic-repository.ts`)
- **`findById()`**: Mengubah parameter dari `string | number` ke `string` (UUID only)
- **`update()`**: Mengubah parameter id dari `string | number` ke `string` (UUID only)
- **`delete()`**: Mengubah parameter id dari `string | number` ke `string` (UUID only)

### 2. **Generic Service** (`src/common/base/generic-service.ts`)
- **`findById()`**: Mengubah parameter id dari `string | number` ke `string` (UUID only)
- **`update()`**: Mengubah parameter id dari `string | number` ke `string` (UUID only)
- **`delete()`**: Mengubah parameter id dari `string | number` ke `string` (UUID only)
- **`upsert()`**: Menambahkan type casting untuk UUID
- **`bulkOperation()`**: Mengubah id type dari `string | number` ke `string` (UUID only)
- **`getRelatedByForeignKey()`**: Mengubah parameter foreignKeyValue dari `any` ke `string` (UUID only)

### 3. **Generic Controller** (`src/common/base/generic-controller.ts`)
- Menambahkan UUID validator import
- **`findById()`**: Menambahkan validasi UUID untuk parameter id
- **`update()`**: Menambahkan validasi UUID untuk parameter id
- **`delete()`**: Menambahkan validasi UUID untuk parameter id
- **`getRelatedByForeignKey()`**: Menambahkan validasi UUID untuk foreign key value jika berformat UUID

### 4. **UUID Validator Utility** (`src/common/utils/uuid-validator.ts`)
File baru yang dibuat untuk validasi format UUID:
- **`validateUUID(uuid)`**: Memvalidasi format UUID string
- **`assertUUID(uuid, paramName)`**: Throw error jika format UUID tidak valid

### 5. **Users Generic Service** (`src/users/users-generic.service.ts`)
- **`findByTenantId()`**: Mengubah parameter dari `number` ke `string` (UUID)
- **`updatePermissions()`**: Mengubah parameter userId dari `string | number` ke `string` (UUID)
- **`hasPermission()`**: Mengubah parameter userId dari `string | number` ke `string` (UUID)

### 6. **Users Generic Controller** (`src/users/users-generic.controller.ts`)
- Menambahkan UUID validator import
- **`findByTenantId()`**: Mengubah parameter dari number ke string dan menambahkan validasi UUID
- **`hasPermission()`**: Menambahkan validasi UUID untuk userId
- **`getUserForEdit()`**: Menambahkan validasi UUID untuk id
- **`editUser()`**: Menambahkan validasi UUID untuk id
- **`updatePermissionsWithMerge()`**: Menambahkan validasi UUID untuk id

### 7. **Keuangan Generic Controller** (`src/keuangan/keuangan-generic.controller.ts`)
- Menambahkan UUID validator import (siap untuk validasi UUID jika diperlukan)

### 8. **DTOs** (`src/users/dto/edit-user.dto.ts`)
- Menambahkan **`UserIdDto`** dengan validator UUID untuk userId parameter
- Menambahkan `@IsUUID('4')` decorator untuk validasi UUID versi 4

## 🔍 UUID Format yang Didukung

Sistem menggunakan UUID versi 4 dengan format standar:
```
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
```

Contoh UUID yang valid:
- `550e8400-e29b-41d4-a716-446655440000`
- `123e4567-e89b-12d3-a456-426614174000`

## 🛡️ Validasi UUID

### Di Controller Level
Setiap endpoint yang menerima UUID parameter akan otomatis divalidasi:

```typescript
@Get(':id')
async findById(@Param('id') id: string) {
  assertUUID(id, 'id'); // Akan throw error jika format tidak valid
  return this.service.findById(id);
}
```

### Di Service Level
Service methods sekarang hanya menerima string (UUID), tidak lagi menerima number:

```typescript
async findById(id: string, options: QueryOptions = {}) {
  // id sudah dipastikan string format UUID
  return this.repository.findById(this.config.tableName, id, mergedOptions);
}
```

### Di DTO Level
Untuk request body yang mengandung UUID:

```typescript
export class UserIdDto {
  @IsUUID('4')
  userId: string;
}
```

## 📊 Contoh Penggunaan dengan UUID

### GET Request dengan UUID
```bash
# Sebelumnya: GET /users/123
# Sekarang: GET /users/550e8400-e29b-41d4-a716-446655440000
curl http://localhost:8080/users/550e8400-e29b-41d4-a716-446655440000
```

### PUT Request dengan UUID
```bash
# Sebelumnya: PUT /users/123
# Sekarang: PUT /users/550e8400-e29b-41d4-a716-446655440000
curl -X PUT http://localhost:8080/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"username": "newusername"}'
```

### DELETE Request dengan UUID
```bash
# Sebelumnya: DELETE /users/123
# Sekarang: DELETE /users/550e8400-e29b-41d4-a716-446655440000
curl -X DELETE http://localhost:8080/users/550e8400-e29b-41d4-a716-446655440000
```

### Filter dengan UUID
```bash
# Filter dengan foreign key UUID
GET /jemaat?filters={"user_id":"550e8400-e29b-41d4-a716-446655440000"}
```

## 🔧 Database Schema Requirements

Pastikan tabel-tabel di database Supabase menggunakan UUID sebagai primary key:

```sql
-- Contoh struktur tabel dengan UUID
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'admin',
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jemaat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR NOT NULL,
    jenis_kelamin VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_app FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
```

## ⚠️ Error Handling

### Invalid UUID Format
Jika format UUID tidak valid, sistem akan throw error:

```json
{
  "statusCode": 400,
  "message": "Invalid UUID format for parameter 'id': invalid-uuid-format"
}
```

### UUID Not Found
Jika UUID tidak ditemukan di database:

```json
{
  "statusCode": 404,
  "message": "user with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

## 🚀 Migration Steps untuk Existing Data

Jika Anda memiliki data existing dengan integer ID, berikut langkah migrasi:

### 1. Backup Database
```sql
-- Backup tabel yang akan di-migrate
CREATE TABLE user_backup AS SELECT * FROM "user";
CREATE TABLE jemaat_backup AS SELECT * FROM jemaat;
```

### 2. Add UUID Column
```sql
-- Tambahkan kolom UUID baru
ALTER TABLE "user" ADD COLUMN new_id UUID DEFAULT uuid_generate_v4();
ALTER TABLE jemaat ADD COLUMN new_id UUID DEFAULT uuid_generate_v4();
```

### 3. Update Foreign Keys
```sql
-- Update foreign key references
ALTER TABLE jemaat ADD COLUMN new_user_id UUID;
UPDATE jemaat SET new_user_id = (SELECT new_id FROM "user" WHERE "user".id = jemaat.user_id);
ALTER TABLE jemaat DROP CONSTRAINT fk_user_app;
ALTER TABLE jemaat ADD CONSTRAINT fk_user_app_new FOREIGN KEY (new_user_id) REFERENCES "user"(new_id);
```

### 4. Replace Primary Keys
```sql
-- Ganti primary key ke UUID
ALTER TABLE "user" DROP CONSTRAINT user_pkey;
ALTER TABLE "user" ADD PRIMARY KEY (new_id);
ALTER TABLE jemaat DROP CONSTRAINT jemaat_pkey;
ALTER TABLE jemaat ADD PRIMARY KEY (new_id);
```

### 5. Clean Up
```sql
-- Hapus kolom lama
ALTER TABLE "user" DROP COLUMN id;
ALTER TABLE "user" RENAME COLUMN new_id TO id;
ALTER TABLE jemaat DROP COLUMN id;
ALTER TABLE jemaat RENAME COLUMN new_id TO id;
ALTER TABLE jemaat DROP COLUMN user_id;
ALTER TABLE jemaat RENAME COLUMN new_user_id TO user_id;
```

## 📝 Frontend Changes

Frontend perlu diupdate untuk mengirim UUID instead of integer IDs:

### React Example
```typescript
// Sebelumnya
const userId = 123;
await axios.put(`/users/${userId}`, userData);

// Sekarang
const userId = '550e8400-e29b-41d4-a716-446655440000';
await axios.put(`/users/${userId}`, userData);
```

### Form Handling
```typescript
// Pastikan form input untuk ID menerima string UUID
const [userId, setUserId] = useState<string>('');

// Generate UUID untuk new record
import { v4 as uuidv4 } from 'uuid';
const newId = uuidv4();
```

## ✅ Testing Checklist

- [ ] Build berhasil tanpa error
- [ ] Server start berhasil
- [ ] GET endpoint dengan UUID berfungsi
- [ ] PUT endpoint dengan UUID berfungsi
- [ ] DELETE endpoint dengan UUID berfungsi
- [ ] Filter dengan UUID berfungsi
- [ ] Foreign key relations dengan UUID berfungsi
- [ ] Validasi UUID format berfungsi
- [ ] Error handling untuk invalid UUID berfungsi

## 🎯 Benefits of UUID Migration

1. **Global Uniqueness**: UUID unik secara global, tidak perlu khawatir tentang conflict
2. **Security**: UUID tidak predictable, lebih secure untuk exposed IDs
3. **Distributed Systems**: Mudah untuk distributed systems dan microservices
4. **No Sequential**: Tidak sequential, tidak reveal information tentang data growth
5. **Standard Format**: Format standar yang didukung oleh banyak database dan tools

## 📚 Related Files

- Generic Repository: `src/common/base/generic-repository.ts`
- Generic Service: `src/common/base/generic-service.ts`
- Generic Controller: `src/common/base/generic-controller.ts`
- UUID Validator: `src/common/utils/uuid-validator.ts`
- Users Service: `src/users/users-generic.service.ts`
- Users Controller: `src/users/users-generic.controller.ts`
- Users DTO: `src/users/dto/edit-user.dto.ts`

## 🔗 References

- UUID RFC 4122: https://tools.ietf.org/html/rfc4122
- Supabase UUID Functions: https://supabase.com/docs/guides/database/functions
- PostgreSQL UUID: https://www.postgresql.org/docs/current/datatype-uuid.html
