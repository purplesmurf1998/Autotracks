//This test does not function with some of the core ui windows
describe('Create Vehicle List Test', () => {
    it('Visits the vehicle list page and adds a new list', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
        cy.visit('#/vehicle-lists')
        //Loading from the database takes a slight amount of time
        cy.wait(1000)         
        //create a vehicle list
        cy.contains("Create a custom vehicle list").click()


        //write List title
        cy.get("[name='new-custom-list-name']").last()
        .type('Test List')
        .should('have.value','Test List') 

        //Choose Dealership
        cy.get("[id='dealership-select-cmb']").last()
        .select('Dealership #10')       
        .should('have.value','61b93a6567cca570f603427d') 

        cy.get("[id='create-vehicle-list']").last().click()

        cy.contains("Test List")
    })
})
