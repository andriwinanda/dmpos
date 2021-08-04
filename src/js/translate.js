import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../store/store.js'
Vue.use(VueI18n);

const messages = {
    'en': {
        dashboard: {
            label: 'Dashboard',
            period: 'Period',
            salesTotal: 'Sales Total',
            purchaseTotal: 'Purchase Total',
            operationalCost: 'Operational Cost',
            profitLoss: 'Profit Loss',
            summary: 'Summary',
            transactionData: 'Transaction Data'
        },
        general: {
            startMonth: 'Start Month',
            endMonth: 'End Month',
            currency: 'Currency',
            type: 'Type',
            generateReport: 'Generate Report',
            summary: 'Summary',
            invoice: 'Invoice',
            nodata: 'No data available',
            customer: 'Customer',
            vendor: 'Vendor',
            branch: 'Branch',
            date: 'Date',
            reset: 'Reset all',
            code: 'Code',
            close: 'Close',
            period: 'Period',
            payment: 'Payment',
            name: 'Name',
            alias: 'Alias',
            phone: 'Phone',
            email: 'Email',
            city: 'City',
            category: 'Category',
            currency: 'Curency',
            description: 'Description',
            amount:'Amount',
            price: 'Price',
            detail: 'Detail',
            logout:'Logout',
            theme: 'Dark Theme'
        },
        cashbank: {
            label: ' Cash Bank',
            cash: 'Cash',
            bank: 'Bank',
            income: 'Income (in IDR)',
            outcome: 'Outcome (in IDR)',
            cashBalance: 'Cash Balance (in IDR)',
            bankBalance: 'Bank Balance (in IDR)'
        },
        sales: {
            label: 'Sales',
            unpaid: 'Unpaid Sales (in IDR)',
            due: 'Sales Due (in IDR)',
            transaction: 'Transaction List'
        },
        purchase: {
            label: 'Purchase',
            unpaid: 'Unpaid Purchase (in IDR)',
            due: 'Purchase Due (in IDR)',
            transaction: 'Transaction List'
        },
        cost: {
            label: 'Cost',
            unpaid: 'Unpaid Cost (in IDR)',
            total: 'Cost Total (in IDR)',
            transaction: 'Transaction List',
            notes: 'Notes'
        },
        contact: {
            label: 'Contact'
        },
        transaction: {
            label: 'Transaction'
        },
        product:{
            label: 'Product',
            weight: 'Weight',
            size: 'Size',
            color: 'Color',
            dimension: 'Dimension'

        },
        report: {
            statement: 'Statement',
            balanceSheet: 'Balance Sheet',
            cashFlow: 'Cash Flow'
        },
        setting: {
            label: 'Setting',
            langLabel: 'Change language',
        },
        login: {
            label: 'Login'
        }

    },
    'id': {
        dashboard: {
            label: 'Halaman Utama',
            period: 'Periode',
            salesTotal: 'Total Penjualan',
            purchaseTotal: 'Total Pembelian',
            operationalCost: 'Biaya Operasional',
            profitLoss: 'Laba Rugi',
            summary: 'Ringkasan',
            transactionData: 'Data Transaksi'
        },
        general: {
            startMonth: 'Mulai Bulan',
            endMonth: 'Akhir Bulan',
            currency: 'Mata Uang',
            type: 'Tipe',
            generateReport: 'Menghasilkan Laporan',
            summary: 'Ringkasan',
            invoice: 'Faktur',
            nodata: 'Tidak ada data tersedia',
            customer: 'Pelanggan',
            vendor: 'Pemasok',
            branch: 'Cabang',
            date: 'Tanggal',
            reset: 'Reset',
            code: 'Kode',
            close: 'Tutup',
            period: 'Periode',
            payment: 'Pembayaran',
            name: 'Nama',
            alias: 'Alias',
            phone: 'Telepon',
            email: 'Email',
            city: 'Kota',
            category: 'Kategori',
            description: 'Deskripsi',
            amount:'Jumlah',
            price: 'Harga',
            detail: 'Rincian',
            logout:'Keluar',
            theme: 'Dark Theme'
        },
        cashbank: {
            label: ' Kas Bank',
            cash: 'Kas',
            bank: 'Bank',
            income: 'Pemasukan (dalam IDR)',
            outcome: 'uaran (dalam IDR)',
            cashBalance: 'Salo Kas (dalam IDR)',
            bankBalance: 'Saldo Bank (dalam IDR)'
        },
        sales: {
            label: 'Penjualan',
            unpaid: 'Penjualan Belum dibayar (dalam IDR)',
            due: 'Penjualan Jatuh Tempo (dalam IDR)',
            transaction: 'Daftar Transaksi'
        },
        purchase: {
            label: 'Pembelian',
            unpaid: 'Pembelian Belum dibayar (dalam IDR)',
            due: 'Pembelian Jatuh Tempo (dalam IDR)',
            transaction: 'Daftar Transaksi'
        },
        cost: {
            label: 'Biaya',
            unpaid: 'Biaya Belum dibayar (dalam IDR)',
            total: 'Total Biaya (dalam IDR)',
            transaction: 'Daftar Transaksi',
            notes: 'Catatan'
        },
        contact: {
            label: 'Kontak'
        },
        transaction: {
            label: 'Transaksi'
        },
        product:{
            label: 'Produk',
            weight: 'Berat',
            size: 'Ukuran',
            color: 'Warna',
            dimension: 'Dimensi'

        },
        report: {
            statement: 'Laporan',
            balanceSheet: 'Neraca',
            cashFlow: 'Arus Kas'
        },
        setting: {
            label: 'Pengaturan',
            langLabel: 'Ubah bahasa',

        },
        login: {
            label: 'Masuk'
        }

    }
};
let lang = store.state.login.lang
const i18n = new VueI18n({
    locale: lang ? lang : 'en', // set locale
    fallbackLocale: 'id', // set fallback locale
    messages, // set locale messages
});

export default i18n;