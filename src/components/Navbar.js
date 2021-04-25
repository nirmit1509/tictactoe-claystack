import React from 'react';

function Navbar( { account, isAdmin } ) {
    return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <h3 className="navbar-brand col-sm-3 col-md-2 mr-0">
                    Tic Tac Toe
                </h3>
                <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-white">
                        <span id="account">
                            { isAdmin ? `(ADMIN) ` : ''}
                            {account}
                        </span>
                    </small>
                </li>
                </ul>
            </nav>
    )
}

export default Navbar;
