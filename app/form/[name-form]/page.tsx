"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/app/components/ToastContext";
import "@/app/ui/auth.css";

type FieldType = "text" | "tel" | "date" | "time" | "email" | "number" | "select" | "textarea";

interface FormField {
	name: string;
	label: string;
	type?: FieldType;
	required?: boolean;
	placeholder?: string;
	options?: string[];
	fullWidth?: boolean;
}

interface FormTemplate {
	title: string;
	description: string;
	icon: string;
	fields: FormField[];
}

const templates: Record<string, FormTemplate> = {
	baptisan: {
		title: "Permohonan Baptisan Kudus",
		description: "Lengkapi data calon peserta baptisan.",
		icon: "fa-water",
		fields: [
			{ name: "nama", label: "Nama yang akan Dibaptis", required: true },
			{ name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
			{ name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir", placeholder: "Kota, DD-MM-YYYY", required: true },
			{ name: "namaAyah", label: "Nama Ayah Kandung", required: true },
			{ name: "namaIbu", label: "Nama Ibu Kandung", required: true },
			{ name: "alamat", label: "Alamat Rumah", required: true, fullWidth: true },
			{ name: "telepon", label: "Nomor HP", type: "tel", required: true },
			{ name: "saksiA", label: "Saksi I" },
			{ name: "saksiB", label: "Saksi II" },
			{ name: "tanggalBaptis", label: "Rencana Tanggal Baptis", type: "date", required: true },
			{ name: "tempatBaptis", label: "Tempat Baptis", required: true },
			{ name: "jamBaptis", label: "Jam Baptis", type: "time" },
		],
	},
	sidi: {
		title: "Pendaftaran Sidi",
		description: "Data peserta katekisasi dan pengakuan percaya.",
		icon: "fa-book-bible",
		fields: [
			{ name: "nama", label: "Nama Lengkap", required: true },
			{ name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
			{ name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir", required: true },
			{ name: "namaAyah", label: "Nama Ayah", required: true },
			{ name: "namaIbu", label: "Nama Ibu", required: true },
			{ name: "pekerjaanOrangTua", label: "Pekerjaan Orang Tua" },
			{ name: "alamat", label: "Alamat", required: true },
			{ name: "telepon", label: "Nomor HP", type: "tel", required: true },
			{ name: "anggotaJemaat", label: "Asal Jemaat" },
			{ name: "tanggalKatekisasi", label: "Rencana Mulai Katekisasi", type: "date" },
		],
	},
	nikah: {
		title: "Pendaftaran Pernikahan",
		description: "Data rencana pemberkatan dan kedua calon mempelai.",
		icon: "fa-ring",
		fields: [
			{ name: "tanggal", label: "Tanggal Pemberkatan", type: "date", required: true },
			{ name: "jam", label: "Jam", type: "time", required: true },
			{ name: "tempat", label: "Tempat", required: true },
			{ name: "priaNama", label: "Nama Calon Mempelai Pria", required: true, fullWidth: true },
			{ name: "priaTempatTanggalLahir", label: "Tempat, Tanggal Lahir Pria" },
			{ name: "priaBaptisSidi", label: "Data Baptis dan Sidi Pria" },
			{ name: "priaPekerjaan", label: "Pekerjaan Pria" },
			{ name: "priaTelepon", label: "Nomor HP Pria", type: "tel" },
			{ name: "wanitaNama", label: "Nama Calon Mempelai Wanita", required: true, fullWidth: true },
			{ name: "wanitaTempatTanggalLahir", label: "Tempat, Tanggal Lahir Wanita" },
			{ name: "wanitaBaptisSidi", label: "Data Baptis dan Sidi Wanita" },
			{ name: "wanitaPekerjaan", label: "Pekerjaan Wanita" },
			{ name: "wanitaTelepon", label: "Nomor HP Wanita", type: "tel" },
			{ name: "catatan", label: "Catatan Tambahan", type: "textarea", fullWidth: true },
		],
	},
	kursus: {
		title: "Pendaftaran Kursus Musik",
		description: "Daftar kursus keyboard, vokal, atau musik gereja.",
		icon: "fa-music",
		fields: [
			{ name: "nama", label: "Nama Peserta", required: true },
			{ name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
			{ name: "kursus", label: "Pilihan Kursus", type: "select", options: ["Keyboard", "Vokal", "Gitar", "Musik Gereja"], required: true },
			{ name: "tingkat", label: "Tingkat", type: "select", options: ["Pemula", "Menengah", "Lanjutan"] },
			{ name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir" },
			{ name: "alamat", label: "Alamat", required: true },
			{ name: "telepon", label: "Nomor HP", type: "tel", required: true },
			{ name: "catatan", label: "Catatan", type: "textarea", fullWidth: true },
		],
	},
	katek: {
		title: "Pendaftaran Katekisasi",
		description: "Form pendaftaran kelas katekisasi jemaat.",
		icon: "fa-chalkboard-user",
		fields: [
			{ name: "nama", label: "Nama Lengkap", required: true },
			{ name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
			{ name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir", required: true },
			{ name: "alamat", label: "Alamat", required: true },
			{ name: "telepon", label: "Nomor HP", type: "tel", required: true },
			{ name: "asalJemaat", label: "Asal Jemaat" },
			{ name: "pendidikan", label: "Pendidikan Terakhir" },
			{ name: "alasan", label: "Alasan Mengikuti Katekisasi", type: "textarea", fullWidth: true },
		],
	},
	"pendaftaran-jemaat": {
		title: "Pendaftaran Anggota Jemaat",
		description: "Daftarkan diri atau keluarga sebagai anggota jemaat.",
		icon: "fa-users",
		fields: [
			{ name: "namaKepalaKeluarga", label: "Nama Kepala Keluarga", required: true },
			{ name: "nomorKK", label: "Nomor KK", required: true },
			{ name: "alamat", label: "Alamat", required: true, fullWidth: true },
			{ name: "telepon", label: "Nomor HP", type: "tel", required: true },
			{ name: "namaAnggota", label: "Nama Anggota Keluarga", required: true, fullWidth: true },
			{ name: "hubungan", label: "Hubungan dengan Kepala Keluarga", type: "select", options: ["Kepala Keluarga", "Istri", "Anak", "Orang Tua", "Lainnya"] },
			{ name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
			{ name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir" },
			{ name: "pekerjaan", label: "Pekerjaan" },
			{ name: "statusBaptisSidi", label: "Status Baptis/Sidi" },
		],
	},
	keuangan: {
		title: "Formulir Transaksi Keuangan",
		description: "Catat penerimaan atau pengeluaran gereja.",
		icon: "fa-file-invoice-dollar",
		fields: [
			{ name: "jenis", label: "Jenis Transaksi", type: "select", options: ["Pemasukan", "Pengeluaran"], required: true },
			{ name: "tanggal", label: "Tanggal", type: "date", required: true },
			{ name: "kategori", label: "Kategori", required: true },
			{ name: "jumlah", label: "Jumlah (Rp)", type: "number", required: true },
			{ name: "sumberTujuan", label: "Sumber/Tujuan Dana", required: true },
			{ name: "nomorBukti", label: "Nomor Bukti" },
			{ name: "keterangan", label: "Keterangan", type: "textarea", fullWidth: true },
		],
	},
};

export default function FormTemplatePage() {
	const params = useParams<{ "name-form": string }>();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<Record<string, string>>({});
	const template = useMemo(() => templates[params["name-form"]?.toLowerCase()], [params]);

	if (!template) {
		return <div className="min-h-screen flex items-center justify-center bg-light text-gray-700">Template formulir tidak ditemukan.</div>;
	}

	const updateField = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }));

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			showToast(`${template.title} berhasil dikirim.`, "success");
			setForm({});
		} catch {
			showToast("Gagal mengirim formulir.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-8 font-sans bg-light" style={{ backgroundImage: "linear-gradient(135deg, rgba(15,26,46,0.9), rgba(30,58,95,0.85)), url('/church-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
			<section className="bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-3xl login-card page-transition p-6 md:p-8">
				<header className="text-center pb-5 border-b border-gray-200 mb-6">
					<i className={`fa-solid ${template.icon} text-4xl text-primary mb-2`} aria-hidden="true" />
					<h1 className="text-xl font-bold text-dark">{template.title}</h1>
					<p className="text-gray-500 text-xs mt-1">Majelis Jemaat GKE Kaharap</p>
					<p className="text-gray-500 text-sm mt-3">{template.description}</p>
				</header>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{template.fields.map((field) => (
						<div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
							<label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
							{field.type === "textarea" ? (
								<textarea id={field.name} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} className="form-input w-full min-h-24" placeholder={field.placeholder} required={field.required} />
							) : field.type === "select" ? (
								<select id={field.name} value={form[field.name] ?? field.options?.[0] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} className="form-input w-full" required={field.required}>
									{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
								</select>
							) : (
								<input id={field.name} type={field.type ?? "text"} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} className="form-input w-full" placeholder={field.placeholder} required={field.required} />
							)}
						</div>
					))}
					<div className="md:col-span-2 pt-2">
						<button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Mengirim..." : "Kirim Formulir"}</button>
					</div>
				</form>
			</section>
		</main>
	);
}
