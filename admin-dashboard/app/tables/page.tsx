import { PageHeader } from '../components/page-header'
import { DataTable } from '../components/data-table'
import { Table } from 'lucide-react'

const data = [
  { id: 1, name: "Product A", category: "Electronics", price: 299.99, stock: 50 },
  { id: 2, name: "Product B", category: "Clothing", price: 49.99, stock: 100 },
  { id: 3, name: "Product C", category: "Home & Garden", price: 99.99, stock: 25 },
  { id: 4, name: "Product D", category: "Electronics", price: 199.99, stock: 30 },
  { id: 5, name: "Product E", category: "Clothing", price: 29.99, stock: 200 },
]

export default function TablesPage() {
  return (
    <div className="pt-[25px] px-8 pb-8">
      <PageHeader title="Data Tables" icon={Table} />
      <div className="space-y-4">
        <DataTable data={data} />
      </div>
    </div>
  )
}

