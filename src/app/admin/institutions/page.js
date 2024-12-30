export default function InstitutionsAdminPage() {
  return (
    <div>
      <h1>Institution Management</h1>

      {/* Tabs for different views */}
      <Tabs defaultValue='pending'>
        <TabsList>
          <TabsTrigger value='pending'>Pending Requests</TabsTrigger>
          <TabsTrigger value='verified'>Verified Institutions</TabsTrigger>
          <TabsTrigger value='add'>Add Institution</TabsTrigger>
        </TabsList>

        {/* Content for each tab */}
        <TabsContent value='pending'>
          <PendingInstitutionsTable />
        </TabsContent>
        <TabsContent value='verified'>
          <VerifiedInstitutionsTable />
        </TabsContent>
        <TabsContent value='add'>
          <AddInstitutionForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
