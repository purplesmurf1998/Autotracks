//This test does not function with some of the core ui windows
describe('Mark Missing Test', () => {
    it('Selects a vehicles and labels it missing', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/inventory')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         
        //create a vehicle list
        //choose a vehicle
        cy.get("tr").eq(3).click()

        //mark missing
        cy.contains("Select an action").click()
        cy.contains("Missing / Misplaced").click()

        cy.get("[class='close']").eq(0).click()
        cy.get("[name='header-nav-link']").click()
    })
})