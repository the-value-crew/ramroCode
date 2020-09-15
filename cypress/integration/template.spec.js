describe("Template test", () => {
    it("Change change the template", () => {
        cy.visit("/");
        cy.get("#code").type("Hello World").should("have.value", "Hello World");
    });
});