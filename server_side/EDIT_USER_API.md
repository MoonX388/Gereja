# 📝 Edit User API Documentation

Dokumentasi untuk fitur Edit User menggunakan sistem generic dengan Supabase Client.

## 🔗 Endpoint yang Tersedia

### 1. GET User untuk Edit Form
Mengambil data user lengkap untuk ditampilkan di form edit.

**Endpoint:** `GET /users/edit/:id`

**Contoh Request:**
```bash
GET /users/edit/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "role": "admin",
  "permissions": ["akses_gpanel", "edit_jemaat", "view_keuangan"],
  "jemaat": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nama": "John Doe",
    "status": "aktif"
  },
  "pelayan": [],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. PUT Edit User (Update Profil)
Update data user lengkap (username, email, password, role, permissions).

**Endpoint:** `PUT /users/edit/:id`

**Contoh Request:**
```bash
PUT /users/edit/550e8400-e29b-41d4-a716-446655440000
```

**Payload JSON Options:**

#### A. Update Username Saja
```json
{
  "username": "newusername123"
}
```

#### B. Update Email Saja
```json
{
  "email": "newemail@example.com"
}
```

#### C. Update Password Saja
```json
{
  "password": "newSecurePassword123"
}
```

#### D. Update Role Saja
```json
{
  "role": "superadmin"
}
```

#### E. Update Permissions Saja
```json
{
  "permissions": ["akses_gpanel", "edit_jemaat", "view_keuangan", "delete_user"]
}
```

#### F. Update Semua Field
```json
{
  "username": "johndoe_updated",
  "email": "john.updated@example.com",
  "password": "newSecurePassword123",
  "role": "admin",
  "permissions": ["akses_gpanel", "edit_jemaat", "view_keuangan"]
}
```

#### G. Update Sebagian Field
```json
{
  "username": "johndoe_updated",
  "email": "john.updated@example.com",
  "role": "admin"
}
```

**Response Success:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.updated@example.com",
  "username": "johndoe_updated",
  "role": "admin",
  "permissions": ["akses_gpanel", "edit_jemaat", "view_keuangan"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response Error (Username sudah ada):**
```json
{
  "statusCode": 500,
  "message": "Username sudah digunakan oleh user lain"
}
```

**Response Error (Email sudah ada):**
```json
{
  "statusCode": 500,
  "message": "Email sudah digunakan oleh user lain"
}
```

---

### 3. PATCH Update Permissions dengan Merge Strategy
Update permissions dengan strategi merge (add/remove/set).

**Endpoint:** `PATCH /users/permissions/:id`

**Contoh Request:**
```bash
PATCH /users/permissions/550e8400-e29b-41d4-a716-446655440000
```

**Payload JSON Options:**

#### A. Tambah Permissions (Add)
```json
{
  "add": ["edit_keuangan", "delete_jemaat"]
}
```
*Hasil: Permissions baru akan ditambahkan ke permissions yang sudah ada.*

#### B. Hapus Permissions (Remove)
```json
{
  "remove": ["delete_user", "edit_settings"]
}
```
*Hasil: Permissions yang disebutkan akan dihapus dari permissions yang sudah ada.*

#### C. Set Permissions (Set Full)
```json
{
  "set": ["akses_gpanel", "edit_jemaat"]
}
```
*Hasil: Permissions akan di-replace sepenuhnya dengan array baru.*

#### D. Add dan Remove Sekaligus
```json
{
  "add": ["edit_keuangan"],
  "remove": ["delete_user"]
}
```
*Hasil: Menambahkan permissions baru dan menghapus permissions tertentu.*

**Response Success:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "role": "admin",
  "permissions": ["akses_gpanel", "edit_jemaat", "edit_keuangan"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🎯 Contoh Implementasi Frontend

### React / Axios Example

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/users';

// Get user untuk edit form
const getUserForEdit = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/edit/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Update user profil
const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/edit/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update permissions dengan merge
const updatePermissions = async (userId: string, permissions: any) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/permissions/${userId}`, permissions);
    return response.data;
  } catch (error) {
    console.error('Error updating permissions:', error);
    throw error;
  }
};

// Contoh penggunaan dalam komponen React
const EditUserForm = ({ userId }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    permissions: []
  });

  // Load user data saat component mount
  useEffect(() => {
    getUserForEdit(userId).then(data => {
      setUserData({
        username: data.username,
        email: data.email,
        role: data.role,
        permissions: data.permissions || []
      });
    });
  }, [userId]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateUser(userId, userData);
      alert('User berhasil diupdate!');
    } catch (error) {
      alert('Gagal mengupdate user: ' + error.message);
    }
  };

  // Handle permission change
  const handlePermissionToggle = (permission: string) => {
    setUserData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userData.username}
        onChange={(e) => setUserData({...userData, username: e.target.value})}
        placeholder="Username"
      />
      <input
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
        placeholder="Email"
      />
      <select
        value={userData.role}
        onChange={(e) => setUserData({...userData, role: e.target.value})}
      >
        <option value="jemaat">Jemaat</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Superadmin</option>
      </select>
      
      {/* Permission checkboxes */}
      {['akses_gpanel', 'edit_jemaat', 'view_keuangan'].map(permission => (
        <label key={permission}>
          <input
            type="checkbox"
            checked={userData.permissions.includes(permission)}
            onChange={() => handlePermissionToggle(permission)}
          />
          {permission}
        </label>
      ))}
      
      <button type="submit">Update User</button>
    </form>
  );
};
```

### Fetch API Example

```javascript
// Get user untuk edit
async function getUserForEdit(userId) {
  const response = await fetch(`http://localhost:8080/users/edit/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return await response.json();
}

// Update user
async function updateUser(userId, userData) {
  const response = await fetch(`http://localhost:8080/users/edit/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) throw new Error('Failed to update user');
  return await response.json();
}

// Update permissions
async function updatePermissions(userId, permissions) {
  const response = await fetch(`http://localhost:8080/users/permissions/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(permissions),
  });
  
  if (!response.ok) throw new Error('Failed to update permissions');
  return await response.json();
}
```

---

## 🔒 Validasi di Backend

### EditUserDto Validasi:
- `username`: Minimal 3 karakter, string
- `email`: Harus format email yang valid
- `password`: Minimal 6 karakter, string
- `role`: Harus salah satu dari: 'admin', 'jemaat', 'pelayan', 'superadmin'
- `permissions`: Array of strings

### Business Logic Validasi:
- Username harus unik (tidak boleh sama dengan user lain)
- Email harus unik (tidak boleh sama dengan user lain)
- User harus ada sebelum bisa diupdate

---

## 📋 Role yang Tersedia

```typescript
type UserRole = 'admin' | 'jemaat' | 'pelayan' | 'superadmin';
```

---

## 🎨 Contoh Permissions yang Tersedia

```typescript
const AVAILABLE_PERMISSIONS = [
  'akses_gpanel',        // Akses ke GPanel
  'edit_jemaat',         // Edit data jemaat
  'view_keuangan',       // View data keuangan
  'edit_keuangan',       // Edit data keuangan
  'delete_user',         // Hapus user
  'edit_settings',       // Edit pengaturan
  'view_jadwal',         // View jadwal
  'edit_jadwal',         // Edit jadwal
  'manage_inventaris',   // Kelola inventaris
  'send_notifikasi'      // Kirim notifikasi
];
```

---

## 🚀 Quick Test dengan cURL

### Test Get User for Edit
```bash
curl -X GET http://localhost:8080/users/edit/550e8400-e29b-41d4-a716-446655440000
```

### Test Update User
```bash
curl -X PUT http://localhost:8080/users/edit/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "email": "newemail@example.com",
    "role": "admin"
  }'
```

### Test Update Permissions (Add)
```bash
curl -X PATCH http://localhost:8080/users/permissions/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "add": ["edit_keuangan", "delete_user"]
  }'
```

### Test Update Permissions (Remove)
```bash
curl -X PATCH http://localhost:8080/users/permissions/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "remove": ["delete_user"]
  }'
```

---

## 📝 Catatan Penting

1. **UUID Format**: User ID menggunakan format UUID, pastikan frontend mengirim UUID yang valid
2. **Password Hashing**: Password akan di-hash otomatis di backend, tidak perlu hash di frontend
3. **Permissions Format**: Permissions disimpan sebagai JSONB array di database
4. **Optional Fields**: Semua field di payload adalah optional, hanya field yang dikirim yang akan diupdate
5. **Error Handling**: Frontend harus handle error untuk username/email yang sudah ada
6. **Merge Strategy**: Gunakan endpoint PATCH untuk update permissions dengan strategi merge yang lebih fleksibel

---

## 🔗 Related Files

- Service: `src/users/users-generic.service.ts`
- Controller: `src/users/users-generic.controller.ts`
- DTO: `src/users/dto/edit-user.dto.ts`
- Generic System: `src/common/base/`
