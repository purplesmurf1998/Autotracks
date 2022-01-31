describe('Assign Salesperson And Sell VehicleTest', () => {
    it('Visits the inventory page and assigns a vehicle a salesperson', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/inventory')
        //Loading from the database takes a slight amount of time    
        
        cy.contains("Inventory list of vehicles")
        cy.wait(1000)
        //Selecting a dealership
        cy.get("tr").eq(7).click()

        //press select an action button
        cy.contains('Select an action').click()

        //press sell vehicle button
        cy.contains('Sell Vehicle').click()

        //enter sale and deposit amounts then choose manager
        cy.get("[name='deposit-amount']")
        .clear()
        .type('15')
        .should('have.value', '15')

        cy.get("[name='sale-amount']")
        .clear()
        .type('10')
        .should('have.value', '10')

        cy.get("[name='select-manager']")
        .select('Abdul The Manager')
        .should('have.value', '61f0a1e0d8d6f57a7fcf9b67')

        //create the transaction and check if it exists
        cy.contains('Create').click()
        
        cy.visit('#/transactions')
        cy.wait(1000)
        cy.get("tr").eq(12).click()
        cy.contains("Approve Sale").click()

    })
})