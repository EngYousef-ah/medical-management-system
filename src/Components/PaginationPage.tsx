import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/Components/ui/pagination"

type Props = {
  totalPages: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function PaginationPage({ totalPages, currentPage, setCurrentPage, }: Props) {
  return (
    <Pagination>

      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((p) => p - 1)
              }
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (

          <PaginationItem key={i}>

            <PaginationLink className={`${currentPage === i + 1
              ? "bg-[#23a997] text-white"
              : "bg-white text-gray-700"
              }`}
              isActive={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>

          </PaginationItem>

        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage((p) => p + 1)
              }
            }}
          />
        </PaginationItem>

      </PaginationContent>

    </Pagination>
  )
}