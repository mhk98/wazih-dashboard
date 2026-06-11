import { Download, Eye, Printer, PlayCircle } from 'lucide-react';

const products = [
  'AMBER ABIYAD',
  'AMBER GRIS BLACK',
  'Amber Attar',
  'AMBER GRIS ROYAL',
  'AMBER OUD CLEAN',
  'Amber Oud',
  'AMBER ROSE',
  'Bergamot',
  'Black Rose',
  'Body Kouros',
  'BOIS DE OUD',
  'Bulgarian Lavender Attar',
  'Cambodi Maliki',
  'CAMBODI QADEEM',
  'Celestial Garden',
  'Damascus Rose',
  'Damask Al Hatab',
  'Deer Musk Oud Elite',
  'DEER MUSK SULTAN',
  'DEHNAL OUD SUYUFI',
];

const stockRows = products.map((product, index) => {
  const stock = [102, 102, 2, 102, 1503, 1503, 1500, 1500, 1500, 1500][index % 10];
  const purchasePrice = [300, 10000, 1500, 4000, 800, 1200, 600, 600, 1500, 800][index % 10];
  const salePrice = [450, 12000, 2000, 5000, 1000, 1500, 750, 750, 2000, 1000][index % 10];
  return {
    product,
    category: 'ATTAR & OILS',
    purchasePrice,
    salePrice,
    stock,
    purchaseValue: purchasePrice * stock,
    saleValue: salePrice * stock,
  };
});

const purchaseRows = Array.from({ length: 50 }, (_, index) => ({
  date: index < 11 ? '27-11-2025' : index < 15 ? '29-11-2025' : index < 19 ? '19-05-2026' : '18-05-2026',
  invoice: String(index + 1).padStart(6, '0'),
  supplier: index > 26 ? 'Hanif Enterprise' : index % 2 ? 'Md Razu Hosssain Raj' : 'websolution IT',
  qty: [10, 200, 300, 600, 1200, 50, 100, 1520, 1340, 610][index % 10],
  amount: [1800, 500000, 154500, 159900, 1300000, 7500, 18000, 642000, 1114030, 191000][index % 10],
}));

const orderRows = Array.from({ length: 50 }, (_, index) => ({
  date: index < 23 ? '29-11-2025' : index < 27 ? '30-11-2025' : index < 34 ? '02-12-2025' : '13-01-2026',
  invoice: String(index + 1).padStart(6, '0'),
  customer: ['Md Zadu Mia', 'Ashik Islam', 'Nahid Hasan', 'Milon', 'Ekramul haque'][index % 5],
  qty: [3, 1, 1, 2, 4, 10, 5, 16][index % 8],
  amount: [2441, 1560, 1043, 26119, 1000, 550, 509, 900, 4538, 136360][index % 10],
}));

const salesRows = orderRows.slice(0, 25).map((row, index) => ({
  ...row,
  invoice: String([1, 2, 3, 4, 6, 9, 10, 13, 14, 17, 19, 20, 21, 22, 23, 24, 26, 31, 32, 34, 36, 129, 290, 291, 293][index]).padStart(6, '0'),
  amount: [2441, 1560, 1043, 26119, 1000, 550, 509, 900, 1043, 919, 1043, 4538, 4617, 770, 662, 1913, 1043, 662, 4322, 2086, 820, 0, 360, 1709, 800][index],
}));

const expenseRows = [
  ['29-11-2025', 'Ekramul haque', 'Employee Salary', 5000, 'Employee Salary'],
  ['14-12-2025', 'Tea', 'Utility Bill', 500, 'Tea +Biscute'],
  ['18-12-2025', 'Nurul Islam', 'Product Expense', 500, ''],
  ['01-01-2026', 'Boosting', 'Dolar Expense', 1000, ''],
  ['14-01-2026', 'Boost cost for January', 'Boost Cost', 5000, 'dfdfdf'],
  ['14-01-2026', 'Nasta bill', 'Utility Bill', 1000, 'Cash'],
  ['21-04-2026', 'Nasta bill', 'Refreshment Exp', 20, 'Test purpose'],
].map(([date, name, category, amount, note]) => ({ date, name, category, amount, note }));

const reportConfig = {
  stock_report: {
    title: 'Stock Reports',
    filters: ['Show 50', 'Select Category', 'Select Product', 'Start Date', 'End Date'],
    summary: [
      'Total Purchase Value: 764,527,400.00 Tk',
      'Total Stock Qty: 207354',
      'Total Sale Value: 1,052,165,652.00 Tk',
    ],
    headers: ['SL', 'Product', 'Category', 'Purchase Price', 'Sale Price', 'Stock', 'Purchase Value', 'Sale Value'],
    rows: stockRows,
    renderRow: (row, index) => [
      index + 1,
      <span className="inline-flex items-center gap-2" key="product"><ViewButton />{row.product}</span>,
      row.category,
      money(row.purchasePrice),
      money(row.salePrice),
      row.stock,
      money(row.purchaseValue),
      money(row.saleValue),
    ],
  },
  stock_alert_report: {
    title: 'Stock Alert Reports',
    filters: ['Show 50', 'Select Category', 'Select Product'],
    headers: ['SL', 'Product', 'Category', 'Stock', 'Alert Qty'],
    rows: stockRows.filter((row) => row.stock <= 150),
    renderRow: (row, index) => [index + 1, row.product, row.category, row.stock, 100],
  },
  purchase_report: {
    title: 'Purchase Reports',
    filters: ['Show 50 items', 'By Invoice', 'All Supplier', 'Start Date', 'End Date'],
    headers: ['SL', 'Date', 'Invoice', 'Supplier', 'Total Qty', 'Total Amount'],
    rows: purchaseRows,
    footer: ['Grand Total (this page):', '22586', '53,429,780.00 Tk'],
    renderRow: (row, index) => [index + 1, row.date, row.invoice, row.supplier, row.qty, `${money(row.amount)} Tk`],
  },
  order_reports: {
    title: 'Order Reports',
    filters: ['Show 50', 'By Invoice', 'Select Status', 'Start Date', 'End Date', 'Invoice No'],
    headers: ['SL', 'Date', 'Invoice', 'Customer', 'Total Qty', 'Total Amount'],
    rows: orderRows,
    footer: ['Page Total:', '107', '236,183.00 Tk'],
    renderRow: (row, index) => [index + 1, row.date, row.invoice, row.customer, row.qty, `${money(row.amount)} Tk`],
  },
  sales_reports: {
    title: 'Sales Reports',
    filters: ['Show 50', 'By Invoice', 'Select Customer', 'Start Date', 'End Date', 'Invoice No'],
    headers: ['SL', 'Date', 'Invoice', 'Customer', 'Total Qty', 'Total Amount'],
    rows: salesRows,
    footer: ['Page Total:', '53', '61,429.00 Tk'],
    renderRow: (row, index) => [index + 1, row.date, row.invoice, row.customer, row.qty, `${money(row.amount)} Tk`],
  },
  expense_reports: {
    title: 'Expence Reports',
    filters: ['Show 50', 'Keyword', 'Select Category', 'Start Date', 'End Date'],
    headers: ['SL', 'Date', 'Name', 'Category', 'Amount', 'Note'],
    rows: expenseRows,
    footer: ['Page Total:', '13,020.00', ''],
    grandFooter: ['Grand Total:', '13,020.00', ''],
    renderRow: (row, index) => [index + 1, row.date, row.name, row.category, money(row.amount), row.note],
  },
  loss_profit: {
    title: 'Loss/Profit',
    filters: ['Start Date', 'End Date'],
    headers: ['SL', 'Particular', 'Amount'],
    rows: [
      { name: 'Total Sales', amount: 829207 },
      { name: 'Total Purchase Cost', amount: 536500 },
      { name: 'Total Expense', amount: 26350 },
      { name: 'Net Profit', amount: 266357 },
    ],
    renderRow: (row, index) => [index + 1, row.name, `${money(row.amount)} Tk`],
  },
};

export default function ReportsPage({ reportKey }) {
  const report = reportConfig[reportKey] ?? reportConfig.stock_report;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-gray-800">{report.title}</h1>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600">
            <PlayCircle size={15} />
            টিউটোরিয়াল দেখুন
          </button>
          <ActionButton icon={Download} label="Excel" tone="teal" />
          <ActionButton icon={Printer} label="Print" tone="rose" />
        </div>
      </div>

      <div className="rounded bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded border border-slate-200 bg-slate-50 p-4">
          {report.filters.map((filter) => (
            <FilterControl key={filter} label={filter} />
          ))}
          <button type="button" className="h-9 rounded bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700">
            {reportKey === 'purchase_report' || reportKey === 'order_reports' || reportKey === 'sales_reports'
              ? 'Submit'
              : reportKey === 'expense_reports'
                ? 'Apply'
                : 'Filter'}
          </button>
        </div>

        {report.summary && (
          <div className="mb-5 space-y-1 text-xs font-semibold text-gray-600">
            {report.summary.map((item) => <div key={item}>{item}</div>)}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100">
                {report.headers.map((header) => (
                  <th key={header} className="border border-slate-200 px-3 py-3 text-left font-semibold text-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row, index) => (
                <tr key={`${report.title}-${index}`} className="hover:bg-slate-50">
                  {report.renderRow(row, index).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-slate-200 px-3 py-3 text-gray-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {report.footer && (
              <tfoot>
                <tr>
                  <td colSpan={Math.max(report.headers.length - 3, 1)} className="px-3 py-4" />
                  {report.footer.map((cell) => (
                    <td key={cell} className="border-t border-slate-200 px-3 py-4 text-xs font-bold text-gray-600">
                      {cell}
                    </td>
                  ))}
                </tr>
                {report.grandFooter && (
                  <tr>
                    <td colSpan={Math.max(report.headers.length - 3, 1)} className="px-3 py-4" />
                    {report.grandFooter.map((cell) => (
                      <td key={cell} className="border-t border-slate-200 px-3 py-4 text-xs font-bold text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                )}
              </tfoot>
            )}
          </table>
        </div>

        <div className="mt-6 flex items-center gap-1">
          {['‹', '1', '2', '3', '4', '›'].map((page) => (
            <button
              key={page}
              type="button"
              className={`h-8 min-w-8 rounded border border-slate-200 px-2 text-xs ${
                page === '1' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterControl({ label }) {
  const isDate = label.toLowerCase().includes('date');
  const isInput = label === 'Invoice No' || label === 'Keyword';

  if (isDate || isInput) {
    return (
      <input
        type={isDate ? 'text' : 'text'}
        placeholder={label}
        className="h-9 min-w-36 rounded border border-slate-300 bg-white px-3 text-xs text-gray-500 outline-none focus:border-indigo-400"
      />
    );
  }

  return (
    <select className="h-9 min-w-36 rounded border border-slate-300 bg-white px-3 text-xs text-gray-600 outline-none focus:border-indigo-400">
      <option>{label}</option>
    </select>
  );
}

function ActionButton({ icon: Icon, label, tone }) {
  const colors = tone === 'teal' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-rose-500 hover:bg-rose-600';
  return (
    <button type="button" className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition ${colors}`}>
      <Icon size={14} />
      {label}
    </button>
  );
}

function ViewButton() {
  return (
    <span className="inline-flex h-7 w-9 items-center justify-center rounded bg-indigo-600 text-white">
      <Eye size={13} />
    </span>
  );
}

function money(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
