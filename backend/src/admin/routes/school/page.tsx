import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, Pencil, Trash } from "@medusajs/icons"
import { Container, Heading, Toaster, toast } from "@medusajs/ui"
import { Header } from "../../components/header"
import { CreateSchoolForm } from "./create-school"
import { Table } from "../../components/table"
import { ActionMenu } from "../../components/action-menu"
import { useQuery, useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/config"
import { useState } from "react"

const SchoolPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10


  const { data, isLoading, refetch } = useQuery({
    queryKey: ["schools", currentPage],
    queryFn: () => sdk.listSchools(),
  })
  
  //TODO
  const { mutate: deleteSchool } = useMutation({
    mutationFn: (id: string) => sdk.deleteSchool(id),
    onSuccess: () => {
      toast("School deleted successfully")
      refetch()
    },
    onError: () => {
      toast("Failed to delete school")
    },
  })

  const columns = [
    { key: "name", label: "Name" },
    { key: "shortName", label: "Short Name" },
    { key: "type", label: "Type" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    {
      key: "actions",
      label: "Actions",
      render: (school: any) => (
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: "Edit",
                  icon: <Pencil />,
                  onClick: () => {
                    // Implement edit functionality
                    console.log("Edit school", school.id)
                  },
                },
                {
                  label: "Delete",
                  icon: <Trash />,
                  onClick: () => deleteSchool(school.id),
                },
              ],
            },
          ]}
        />
      ),
    },
  ]

  return (
    <>   <Toaster />
      <Container>

        <Header
          title="Schools"
          actions={[
            {
              type: "custom",
              children: <CreateSchoolForm onSuccess={refetch} />,
            },
          ]}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table
            columns={columns}
            data={data?.schools || []}
            pageSize={pageSize}
            count={data?.count || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container></>
  )
}

export const config = defineRouteConfig({
  label: "School",
  icon: ChatBubbleLeftRight,
})

export default SchoolPage

