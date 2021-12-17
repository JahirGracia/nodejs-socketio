const path = require('path');
const fs = require('fs');

class Ticket {

    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0; // Ultimo ticket que estamos atendiendo
        this.hoy = new Date().getDate(); // 17   <-- Sólo el día
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        // const data = require('../db/data.json');
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');

        if( hoy === this.hoy ) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4
        } else {
            // Es otro día
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync(dbPath, JSON.stringify( this.toJson ))
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();

        return 'Ticket ' + this.ultimo;
    }

    atenderTicket( escritorio ) {

        // No tenemos tickets
        if( this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets[0];
        this.tickets.shift(); // Eliminamos el primer elemento del arreglo

        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket ); // Añadimos el ticket al inicio del arreglo de los ultimos 4

        if( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1, 1) // Quitamos el ultimo si ya tiene más de 4
        }

        this.guardarDB();

        return ticket;
    }
}

module.exports = TicketControl;