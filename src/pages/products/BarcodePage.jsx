import { useMemo, useState } from 'react';
import { ChevronDown, Video } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

export default function BarcodePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const { data: allProducts } = useProducts({ limit: 200 });

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = query
      ? allProducts.filter((p) => p.name.toLowerCase().includes(query))
      : allProducts;
    return list.slice(0, 8);
  }, [search, allProducts]);

  function handleSelect(product) {
    setSelectedProduct(product);
    setSearch('');
    setIsOpen(false);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-gray-800">Product Barcode</h1>
        <button className="flex w-fit items-center gap-1.5 self-end bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition">
          <Video size={14} />
          টিউটোরিয়াল দেখুন
        </button>
      </div>

      <div className="mx-auto w-full max-w-[1060px]">
        <label className="mb-2 block text-sm font-bold text-gray-500">Products *</label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-9 w-full items-center justify-between border border-gray-400 bg-white px-2 text-left text-sm text-gray-700"
          >
            <span>{selectedProduct ? productLabel(selectedProduct) : 'Select Product..'}</span>
            <ChevronDown size={16} className={`text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 z-20 border-x border-b border-gray-400 bg-white shadow-sm">
              <div className="border-b border-gray-300 p-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="h-8 w-full border border-gray-400 px-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>

              <div className="max-h-52 overflow-y-auto pr-1">
                <OptionRow active={!selectedProduct} onClick={() => setSelectedProduct(null)}>
                  Select Product..
                </OptionRow>

                {filteredProducts.map((product) => (
                  <OptionRow
                    key={product.Id}
                    active={selectedProduct?.Id === product.Id}
                    onClick={() => handleSelect(product)}
                  >
                    {productLabel(product)}
                  </OptionRow>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="px-2 py-3 text-sm text-gray-400">No product found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function productLabel(product) {
  return `${product.name}${product.price ? ` - ${product.price}` : ''}`;
}

function OptionRow({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full px-2 py-2 text-left text-sm transition ${
        active ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
}
