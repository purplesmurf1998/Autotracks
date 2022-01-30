describe('Edit Vehicle Property Test', () => {
    it('Visits the dealerships page and modifying a selected dealership', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/inventory')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         

        cy.contains("Inventory list of vehicles")

        //Selecting a dealership
        cy.get("tr").eq(3).click()

        //press edit vehicles button
        cy.contains('Edit vehicle properties').click()

        //write to notes
        cy.get("[name='notes']")
        .clear()       
        .type("New Notes Added")
        .should('have.value','New Notes Added') 

        cy.contains('Save changes').click()

        cy.contains("New Notes Added")



    })
})
