describe('Marking Vehicle Delivered Test', () => {
    it('Visits the transactions page and marks a vehicle delivered', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/transactions')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         
        //choose a vehicle
        cy.get("tr").eq(3).click()

        //mark delivered
        cy.contains("Mark as Delivered").click()
        


    })
})