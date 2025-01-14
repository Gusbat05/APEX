import { PageHeader } from '../components/page-header'
import { UploadForm } from '../components/upload-form'
import { Upload } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="pt-[25px] px-8 pb-8">
      <PageHeader title="Upload Excel File" icon={Upload} />
      <div className="space-y-4">
        <UploadForm />
      </div>
    </div>
  )
}

