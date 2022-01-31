describe('Add Vehicle Test', () => {
    it('Visits the dealerships page and creates a vehicle', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/inventory')
        //Loading from the database takes a slight amount of time
        cy.wait(1000)         

        cy.contains("Inventory list of vehicles")
        //Clicking the add vehicle button
        cy.get("#add-new-vehicle")
        .click()
        //Entering all the vehical properties
        cy.get("[name='vin']")
        .clear()
        .type("11223311111111111")
        .should('have.value', '11223311111111111')

        cy.get("[name='model']")
        .select('Q5 Sportback')
        .should('have.value', 'Q5 Sportback')

        cy.get("[name='model#']")
        .clear()
        .type("987")
        .should('have.value', '987')

        cy.get("[name='modelDescription']")
        .select('Technik')
        .should('have.value', 'Technik')

        cy.get("[name='exteriorColor']")
        .clear()
        .type("black")
        .should('have.value', 'black')

        cy.get("[name='interiorColor']")
        .clear()
        .type("red")
        .should('have.value', 'red')

        cy.get("[name='options']")
        .clear()
        .type("2 doors;4 doors")
        .should('have.value', '2 doors;4 doors')

        cy.get("[name='order#']")
        .clear()
        .type("1")
        .should('have.value', '1')

        cy.get("[name='serialNumber']")
        .clear()
        .type("92843A4")
        .should('have.value', '92843A4')

        cy.get("[name='stock#']")
        .clear()
        .type("1")
        .should('have.value', '1')    
        
        cy.get("[name='status']")
        .select('Ex-Demo')
        .should('have.value', 'Ex-Demo')

        cy.get("[name='onRoadSince']")
        .clear()
        .type("1999-01-19")
        .should('have.value', '1999-01-19')    

        cy.get("[name='notes']")
        .clear()
        .type("none")
        .should('have.value', 'none')      
        
        //click add vehicle
        cy.get('#create-vehicle')
        .click()
        //click no button
        cy.get('#no-button')
        .click()
        //Wait for table to load
        cy.wait(1000)
        //check if it contains the new car
        cy.get('table').contains('td','11223311111111111')
    })
})
