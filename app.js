const express = require('express');  // Import Express
const app = express();               // Initialize the app
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const db = require('./database/db'); // Import the database connection
const fs = require('fs'); // Import File System



// login code

// Required imports
const session = require('express-session');
const dotenv = require('dotenv');

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});


// Load environment variables
dotenv.config();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,

}));

//Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Store with original extension
  }
});

const upload = multer({ storage: storage });







// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "assets" folder
app.use(express.static(path.join(__dirname, 'assets')));








// Routes

// ------------ front-end ---------------------//

app.get('/',  (req, res) => {
  res.render('home'); // renders views/home.ejs
});

app.get('/home', (req, res) => {
  res.render('home'); // renders views/home.ejs
});

app.get('/about', (req, res) => {
  res.render('about'); // renders views/about.ejs
});

// app.get('/partner', (req, res) => {
//   res.render('be-partner'); // renders views/partner.ejs
// });

app.get('/support', (req, res) => {
  res.render('support'); // renders views/support.ejs
});


app.get('/shop',  (req, res) => {

  const userId = req.params.userId;
  const { sortBy, partnerName } = req.query;

  // Query to retrieve bags
  let bagQuery = `SELECT * FROM bag_partner_view`;
  const queryParams = [];

  // Filter bags by partnerName if provided
  if (partnerName) {
    bagQuery += ` WHERE partnerName = ?`;
    queryParams.push(partnerName);
  }

  // Sort bags based on the sortBy parameter
  if (sortBy === 'priceAsc') {
    bagQuery += ' ORDER BY priceAfter ASC';
  } else if (sortBy === 'priceDesc') {
    bagQuery += ' ORDER BY priceAfter DESC';
  }

  // Query to retrieve partners
  const partnerQuery = `SELECT * FROM partners WHERE role='partner'`;

  // Execute both queries
  db.query(bagQuery, queryParams, (err, bags) => {
    if (err) {
      console.error('Error retrieving bag details:', err);
      return res.status(500).send('Error retrieving bag details.');
    }

    db.query(partnerQuery, (err, partners) => {
      if (err) {
        console.error('Error retrieving partner details:', err);
        return res.status(500).send('Error retrieving partner details.');
      }

      // Render the dashboard with both bags and partners
      res.render('shop', {
        userId,
        bags,
        partners,
        sortBy,
        partnerName,
      });
    });
  });
});



// ------------ back-end ---------------------//


// Middleware to pass session data to views
app.use((req, res, next) => {
  if (req.session.partner) {
    res.locals.partnerName = req.session.partner.name;
    res.locals.partnerPhoto = req.session.partner.photo;
    res.locals.role = req.session.partner.role
  } else {
    res.locals.partnerName = null;
    res.locals.partnerPhoto = null;
    res.locals.role = null;
  }

  next();
});

app.use((req, res, next) => {
  res.locals.failedMessage = req.session.failedMessage || null;
  res.locals.successMessage = req.session.successMessage || null;

  // Clear the messages after they're used
  req.session.failedMessage = null;
  req.session.successMessage = null;
  next();
});



// Render partner login page
app.get('/partner/login', (req, res) => {
  res.render('partner/login');
});


// 4. Authorization Middleware

app.post('/Partner/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM partners WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).send('Error during login.');
    }

    if (results.length > 0 && results[0].password === password) {
      // Correct password - store partner data in the session
      req.session.partner = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        photo: results[0].photo,
        role: results[0].role
      };

      if (req.session.partner.role == "admin") {
        return res.redirect(`/admin/viewPartners/${results[0].id}`);
      } else {
        return res.redirect(`/partner/dashboard/${results[0].id}`);
      }


    } else {
      req.session.failedMessage = "Wrong Email or Paasword"
      return res.redirect('/partner/login');
    }
  });
});


function validateReferrer(req, res, next) {
  const allowedReferers = [
    `http://localhost:3000`, // Add your domain or allowed URLs

  ];

  const referer = req.get('Referer');

  if (referer && allowedReferers.some(url => referer.startsWith(url))) {
    next(); // Referrer is valid, proceed to the route
  } else {
    res.status(403).redirect("/logout");
  }
}

function isAuthenticated(req, res, next) {
  if (req.session.partner) {
    console.log(req.session.partner);
    console.log(req.session.user);

    return next();
  } else {
    console.log(req.session.partner);
    console.log(req.session.user);

    return res.status(401).redirect('/partner/login');
  }
}

function isAuthorized(req, res, next) {
  const requestedPartnerId = parseInt(req.params.partnerId, 10);
  const requestedPartnerId2 = parseInt(req.params.id, 100);
  const loggedInPartnerId = req.session.partner.id;

  // Check if either partner ID matches the logged-in partner
  if ((requestedPartnerId === loggedInPartnerId) || (requestedPartnerId2 === loggedInPartnerId)) {
    return next();  // Allow access if they match
  } else {
    console.log(requestedPartnerId);
    console.log(loggedInPartnerId);

    // Redirect to the same page if unauthorized

    return res.redirect('/logout');
  }
}





app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out.');
    }

    // Clear browser cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');



    res.redirect('/home');
  });
});




// ------------ Admin ---------------------//

app.get('/admin/viewPartners/:partnerId', isAuthenticated, isAuthorized, (req, res) => {

  if (!req.session.partner) {
    return res.redirect('/login');  // In case it's not set for any reason
  }
  console.log(req.session.partner);

  const partnerId = parseInt(req.params.partnerId, 10);


  // Validate partnerId
  if (!partnerId || isNaN(partnerId)) {
    return res.status(400).send('Invalid Partner ID.');
  }

  // Query to get partners by partner ID
  const query = 'SELECT * FROM partners WHERE role="partner" ';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving partners:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the partners data
    res.render('admin/ViewPartners', { partners: results, partnerId });
  });
});

app.get('/admin/viewPartner/:id', isAuthenticated, validateReferrer, (req, res) => {

  if (!req.session.partner) {
    return res.redirect('/login');  // In case it's not set for any reason
  }
  console.log(req.session.partner);

  const viewpartnerId = req.params.id;
  const partnerId = req.session.partner.id;

  // Validate partnerId
  if (!partnerId || isNaN(partnerId)) {
    return res.status(400).send('Invalid Partner ID.');
  }

  // Query to get partners by partner ID
  const query = 'SELECT * FROM partners WHERE id = ? ';
  db.query(query, [viewpartnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving partners:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the partners data
    res.render('admin/ViewPartner', { partner: results[0], partnerId });
  });
});

app.post('/admin/partners/:id/delete', (req, res) => {
  const id = req.params.id;
  const partnerId = req.session.partner.id;

  const query = `DELETE FROM partners WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting complaint:', err);
      return res.status(500).send('Error deleting complaint.');
    }

    // Reload the same page
    res.redirect(`/admin/viewPartners/${partnerId}`); // Reloads the referring page
  });
});

app.post('/update-password', (req, res) => {
  const { partner_id, password } = req.body; // Extract 'partner_id' and 'password' from the request body

  // Check if partner_id and password are provided
  if (!partner_id || !password) {
    return res.status(400).send('Partner ID or Password is missing.');
  }

  // SQL query to update the password for the specified partner ID
  const query = 'UPDATE partners SET password = ? WHERE id = ?';
  db.query(query, [password, partner_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to update password.');
    }

    req.session.successMessage = "Password Updated Successfully!";
    // Redirect to the referring page
    res.redirect('back'); // Reloads the referring page
  });
});


app.get('/admin/postPartners/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  // Query to get bags by partner ID
  const query = 'SELECT * FROM partners WHERE id = ?';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the profile data
    res.render('admin/postPartner', { partner: results[0], partnerId });
  });

});




// Route to handle form submission
app.post('/admin/viewPartners', upload.single('photo'), (req, res) => {
  const { name, email, category, number, password, address, city, country, location, role } = req.body;


  const partnerId = req.session.partner.id
  // Check if file was uploaded
  const photo = req.file ? req.file.filename : null;

  const query = `
      INSERT INTO partners (photo, name, email, category, number, password, address, city, country, location, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [photo, name, email, category, number, password, address, city, country, location, role], (err, result) => {
    if (err) {
      console.error(err);
      res.send("There was an error saving the partner.");
    } else {
      // Set a flash message in session
      req.session.successMessage = "Partner Added Successfully!";
      res.redirect(`/admin/viewPartners/${partnerId}`);
    }
  });
});



app.get('/admin/viewInvoices/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  // Query to get bags by partner ID
  const query = 'SELECT * FROM invoice_details';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the profile data
    res.render('admin/viewInvoices', { invoice: results, partnerId });
  });

});


app.get('/admin/viewInvoice/:id', isAuthenticated, validateReferrer, (req, res) => {
  const partnerId = req.session.partner.id;
  const invoiceId = req.params.id
  // Query to get bags by partner ID
  const query = 'SELECT * FROM invoice_details';
  db.query(query, [invoiceId], (err, results) => {
    if (err) {
      console.error('Error retrieving:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the profile data
    res.render('admin/viewInvoice', { invoice: results[0], partnerId });
  });

});


app.post('/update-status', (req, res) => {
  const { status, invoice_id } = req.body;
  console.log(status);
  console.log(invoice_id);


  if (!status || !invoice_id) {
    return res.status(400).send('Status or ID is missing.');
  }


  // Normalize the "Un paid" status to "unpaid" for database consistency
  const normalizedStatus = status === 'Un paid' ? 'unpaid' : status.toLowerCase();

  const query = 'UPDATE invoice_details SET status = ? WHERE invoice_id = ?';
  db.query(query, [normalizedStatus, invoice_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to update status.');
    }

    // Reload the same page
    res.redirect('back'); // Reloads the referring page
  });
});


app.get('/admin/viewOrders/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  // Query to get bags by partner ID
  const query = 'SELECT * FROM single_order_details';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving:', err);
      return res.status(500).send('Error retrieving partners');
    }

    // Render the EJS view and pass the profile data
    res.render('admin/vieworders', { order: results, partnerId });
  });

});


app.get('/admin/viewPartnerSupport/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  // Query to get bags by partner ID
  const query = `
  SELECT 
    c.id AS complaintId,
    c.message,
    c.status,
    p.name AS partnerName,
    p.number AS partnerNumber
  FROM complaints c
  INNER JOIN partners p ON c.sender_id = p.id
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving complaints:', err);
      return res.status(500).send('Error retrieving complaints.');
    }

    res.render('admin/viewPartnerSupport', { complaints: results, partnerId });
  });

});



app.post('/admin/complaints/:complaintId/status', (req, res) => {
  const complaintId = req.params.complaintId;
  const { status } = req.body;

  const query = `UPDATE complaints SET status = ? WHERE id = ?`;

  db.query(query, [status, complaintId], (err) => {
    if (err) {
      console.error('Error updating complaint status:', err);
      return res.status(500).send('Error updating status.');
    }

    // Reload the same page
    res.redirect('back'); // Reloads the referring page
  });
});


app.post('/admin/complaints/:complaintId/delete', (req, res) => {
  const complaintId = req.params.complaintId;

  const query = `DELETE FROM complaints WHERE id = ?`;

  db.query(query, [complaintId], (err) => {
    if (err) {
      console.error('Error deleting complaint:', err);
      return res.status(500).send('Error deleting complaint.');
    }

    // Reload the same page
    res.redirect('back'); // Reloads the referring page
  });
});


// ------------ Partner ---------------------//


app.get('/partner/dashboard/:partnerId', isAuthenticated, isAuthorized, (req, res) => {

  if (!req.session.partner) {
    return res.redirect('/login');  // In case it's not set for any reason
  }
  console.log(req.session.partner);

  const partnerId = parseInt(req.params.partnerId, 10);


  // Validate partnerId
  if (!partnerId || isNaN(partnerId)) {
    return res.status(400).send('Invalid Partner ID.');
  }

  // Query to get bags by partner ID
  const query = 'SELECT * FROM bags WHERE partner_id = ?';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving bags:', err);
      return res.status(500).send('Error retrieving bags');
    }

    // Render the EJS view and pass the bags data
    res.render('partner/dashboard', { bags: results, partnerId });
  });
});


app.get('/partner/postBag/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  // Query to get bags by partner ID
  const query = 'SELECT * FROM partners WHERE id = ?';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving:', err);
      return res.status(500).send('Error retrieving bags');
    }

    // Render the EJS view and pass the profile data
    res.render('partner/postBag', { profile: results[0], partnerId });
  });

});


// Route to handle form submission
app.post('/partner/dashboard', upload.single('photo'), (req, res) => {
  const { name, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter, partner_id } = req.body;

  // Check if file was uploaded
  const photo = req.file ? req.file.filename : null;

  const query = `
      INSERT INTO bags (name,photo, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter, partner_id, addedAt)
      VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(query, [name, photo, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter, partner_id], (err, result) => {
    if (err) {
      console.error(err);
      res.send("There was an error saving the bag.");
    } else {

      // Set a flash message in session
      req.session.successMessage = "Bag Added Successfully!";

      res.redirect(`/partner/dashboard/${partner_id}`);

    }



  });


});


app.get('/partner/viewBag/:id', isAuthenticated, validateReferrer, (req, res) => {
  const bagId = req.params.id;

  // Retrieve partnerId from session
  const partnerId = req.session.partner.id;
  console.log(partnerId);


  const query = "SELECT b.id AS bagId,b.name AS bagName,b.description,b.photo,b.quantity,b.priceAfter,b.priceBefore,b.pickUpTimeStart,b.pickUpTimeEnd,(SELECT COUNT(*) FROM order_details od WHERE od.bag_id = b.id AND od.status = 'reserved') AS reservedCount FROM bags b WHERE b.id=?";

  db.query(query, [bagId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving bag details.');
    }

    if (result.length === 0) {
      return res.status(404).send('Bag not found.');
    }




    // Pass both `bag` and `partnerId` to the template
    res.render('partner/viewBag', { bag: result[0], partnerId });
  });
});


app.get('/partner/bagUpdate/:id', isAuthenticated, validateReferrer, (req, res) => {
  const bagId = req.params.id;

  // Retrieve partnerId from session
  const partnerId = req.session.partner.id;

  const query = 'SELECT * FROM bags WHERE id = ?';

  db.query(query, [bagId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving bag details.');
    }

    if (result.length === 0) {
      return res.status(404).send('Bag not found.');
    }




    // Pass both `bag` and `partnerId` to the template
    res.render('partner/putBag', { bag: result[0], partnerId });
  });
});


app.post('/partner/updateBag/:id', upload.single('photo'), (req, res) => {
  const bagId = req.params.id;
  const { name, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter } = req.body;

  // Check if a new photo was uploaded
  const photo = req.file ? req.file.filename : null;

  // Update query
  const query = photo
    ? `UPDATE bags SET name = ?, photo = ?, description = ?, quantity = ?, pickUpTimeStart = ?, pickUpTimeEnd = ?, priceBefore = ?, priceAfter = ? WHERE id = ?`
    : `UPDATE bags SET name = ?, description = ?, quantity = ?, pickUpTimeStart = ?, pickUpTimeEnd = ?, priceBefore = ?, priceAfter = ? WHERE id = ?`;

  // Determine values for the query
  const values = photo
    ? [name, photo, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter, bagId]
    : [name, description, quantity, pickUpTimeStart, pickUpTimeEnd, priceBefore, priceAfter, bagId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating bag:', err);
      return res.status(500).send('Error updating bag');
    }

    // Set a flash message in session
    req.session.successMessage = "Bag Edited Successfully!";

    // Redirect to the bag's view page after the update
    res.redirect(`/partner/viewBag/${bagId}`);
  });
});


app.post('/admin/bags/:bagId/delete', (req, res) => {
  const bagId = req.params.bagId;
  const partnerId = req.session.partner.id;

  const query = `DELETE FROM bags WHERE id = ?`;

  db.query(query, [bagId], (err) => {
    if (err) {
      console.error('Error deleting complaint:', err);
      return res.status(500).send('Error deleting complaint.');
    }

    // Reload the same page
    res.redirect(`/partner/dashboard/${partnerId}`); // Reloads the referring page
  });
});


app.get('/partner/orders/:partnerId', isAuthenticated, isAuthorized, (req, res) => {

  const partnerId = req.params.partnerId;

  const query = `
      SELECT * 
        FROM order_details
        WHERE partner_name IN (
            SELECT name FROM partners WHERE id = ?
        )

  `;

  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error retrieving orders:', err);
      return res.status(500).send('Error retrieving orders.');
    }

    // Render the orders page with the retrieved results
    res.render('partner/orders', { orders: results, partnerId });
  });
});



app.get('/partner/invoices/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  const query = `
      SELECT 
            invoices.id AS invoice_id,
            invoices.invoice_number,
            invoices.amount,
            invoices.status,
            invoices.issued_at,
            invoices.due_date,
            invoices.paid_at,
            orders.orderCode AS order_code,
            users.firstName AS user_name,
            users.lastName AS user_last_name,
            partners.name AS partner_name
        FROM invoices
        JOIN orders ON invoices.order_id = orders.id
        JOIN users ON orders.user_id = users.id
        JOIN partners ON invoices.partner_id = partners.id
        WHERE invoices.status = 'unpaid' AND invoices.partner_id = ?
  `;

  db.query(query, [partnerId], (err, results) => {
    if (err) throw err;
    res.render('partner/invoices', { invoices: results, partnerId });
  });

});



app.get('/partner/profile/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  const query = 'SELECT * FROM partners WHERE id = ?';

  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error fetching partner data:', err);
      res.status(500).send('Error fetching partner data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Partner not found');
      return;
    }

    // Render the partner.ejs view with the partner's data
    res.render('partner/profile', { profile: results[0], partnerId });
  });
});


app.get('/partner/profileUpdate/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  const query = 'SELECT * FROM partners WHERE id = ?';

  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error fetching partner data:', err);
      res.status(500).send('Error fetching partner data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Partner not found');
      return;
    }

    // Render the partner.ejs view with the partner's data
    res.render('partner/putProfile', { profile: results[0], partnerId });
  });
});



app.post('/partner/update/:id', upload.single('photo'), (req, res) => {
  const partnerId = req.params.id;
  const { name, email, phone, category, address, city, country, location } = req.body;

  // Check if file was uploaded
  const photo = req.file ? req.file.filename : null;

  if (!photo && !name && !email && !phone && !category) {
    return res.status(400).send('No changes were made.');
  }

  // Fetch current partner details from the database
  const selectQuery = 'SELECT * FROM partners WHERE id = ?';
  db.query(selectQuery, [partnerId], (selectErr, results) => {
    if (selectErr) {
      console.error('Error retrieving partner details:', selectErr);
      return res.status(500).send('Error retrieving partner details.');
    }

    if (results.length === 0) {
      return res.status(404).send('Partner not found.');
    }

    const currentDetails = results[0];

    // Build update query dynamically
    let updateQuery = 'UPDATE partners SET ';
    const updates = [];
    const values = [];

    // Check if fields need to be updated
    if (name && name !== currentDetails.name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email && email !== currentDetails.email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone && phone !== currentDetails.number) {
      updates.push('number = ?');
      values.push(phone);
    }
    if (category && category !== currentDetails.category) {
      updates.push('category = ?');
      values.push(category);
    }
    if (address && address !== currentDetails.address) {
      updates.push('address = ?');
      values.push(address);
    }
    if (city && city !== currentDetails.city) {
      updates.push('city = ?');
      values.push(city);
    }
    if (country && country !== currentDetails.country) {
      updates.push('country = ?');
      values.push(country);
    }
    if (location && location !== currentDetails.location) {
      updates.push('location = ?');
      values.push(location);
    }

    // If photo is updated, include it in the update query
    if (photo) {
      updates.push('photo = ?');
      values.push(photo);

    }

    // If no updates, redirect
    if (updates.length === 0) {
      // Set a flash message in session
      req.session.successMessage = "There is No Updates!";

      return res.redirect(`/partner/profile/${partnerId}`);

    }

    // Complete the update query
    updateQuery += updates.join(', ') + ' WHERE id = ?';
    values.push(partnerId);

    // Execute the update query
    db.query(updateQuery, values, (updateErr, result) => {
      if (updateErr) {
        console.error('Error updating partner details:', updateErr);
        return res.status(500).send('Error updating partner details.');
      }

      console.log('Partner updated successfully:', result);

      // Set a flash message in session
      req.session.successMessage = "Your Profile Edited Successfully!";


      res.redirect(`/partner/profile/${partnerId}`);
    });
  });
});


app.get('/partner/support/:partnerId', isAuthenticated, isAuthorized, (req, res) => {
  const partnerId = req.params.partnerId;
  const query = 'SELECT * FROM partners WHERE id = ?';
  db.query(query, [partnerId], (err, results) => {
    if (err) {
      console.error('Error fetching partner data:', err);
      res.status(500).send('Error fetching partner data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Partner not found');
      return;
    }

    // Render the partner.ejs view with the partner's data
    res.render('partner/support', { profile: results[0], partnerId });
  });
});


app.post('/partner/support', (req, res) => {
  const { sender_id, message } = req.body;



  // Insert complaint into the database
  const query = `INSERT INTO complaints (sender_id, message) VALUES ( ?, ?)`;
  db.query(query, [sender_id, message], (err, results) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      return res.status(500).send('Error submitting complaint.');
    }

    // Set a flash message in session
    req.session.successMessage = "Message Sent Successfully!";

    res.redirect(`/partner/support/${sender_id}`);

  });
});


// ------------ user ---------------------//


function isAuthenticated_user(req, res, next) {
  if (req.session.user) {

    console.log(req.session.user);

    return next();
  } else {

    console.log(req.session.user);

    return res.status(401).redirect('/user/login');
  }
}

function isAuthorized_user(req, res, next) {
  const requesteduserId = parseInt(req.params.userId, 10);

  const loggedInuserId = req.session.user.id;

  // Check if either partner ID matches the logged-in partner
  if ((requesteduserId === loggedInuserId)) {
    return next();  // Allow access if they match
  } else {
    console.log(requesteduserId);
    console.log(loggedInuserId);

    // Redirect to the same page if unauthorized

    return res.status(403).redirect("/logout");  // Redirect to the page they came from
  }
}


app.get('/user/signup', (req, res) => {
  res.render('user/signup');
});


app.post('/user/signup', async (req, res) => {
  const { firstName, lastName, email, password, phone, security_question, birthdate, gender, address, city } = req.body;

  // Validate input (basic example, improve this as needed)
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('All required fields must be filled.');
  }

  try {


    // Insert user into the database
    const query = `
      INSERT INTO users (firstName, lastName, email, password,phone,security_question, birthdate, gender, address, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    db.query(
      query,
      [firstName, lastName, email, password, phone, security_question, birthdate, gender, address, city],
      (err, result) => {
        if (err) {
          console.error(err);
          req.session.failedMessage = "This Email Already Exists"
          return res.redirect('/user/signup'); // Redirect or render success page
        }
        req.session.successMessage = "Your Profile Created Successfully!";
        res.redirect('/user/login'); // Redirect or render success page
      }
    );
  } catch (error) {
    console.error(error);
    req.session.failedMessage = "Your Email Already Exists"
    return res.redirect('/user/signup'); // Redirect or render success page
  }
});



// Render user login page
app.get('/user/login', (req, res) => {
  res.render('user/login');
});


app.post('/user/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      req.session.failedMessage = "Error while login, please try again"
      return res.redirect('/user/login');
    }

    if (results.length > 0 && results[0].password === password) {
      // Correct password - store partner data in the session
      req.session.user = {
        id: results[0].id,
        name: results[0].firstName,
        email: results[0].email,
        photo: results[0].photo
      };

      console.log(req.session.id);



      return res.redirect(`/user/dashboard/${results[0].id}`);
    } else {
      req.session.failedMessage = "Wrong Email or Paasword"
      return res.redirect('/user/login');
    }
  });
});





app.get('/user/dashboard/:userId', isAuthenticated_user, isAuthorized_user, validateReferrer, (req, res) => {
  const userId = req.params.userId;
  const { sortBy, partnerName } = req.query;

  // Query to retrieve bags
  let bagQuery = `SELECT * FROM bag_partner_view`;
  const queryParams = [];

  // Filter bags by partnerName if provided
  if (partnerName) {
    bagQuery += ` WHERE partnerName = ?`;
    queryParams.push(partnerName);
  }

  // Sort bags based on the sortBy parameter
  if (sortBy === 'priceAsc') {
    bagQuery += ' ORDER BY priceAfter ASC';
  } else if (sortBy === 'priceDesc') {
    bagQuery += ' ORDER BY priceAfter DESC';
  }

  // Query to retrieve partners
  const partnerQuery = `SELECT * FROM partners WHERE role='partner'`;

  // Execute both queries
  db.query(bagQuery, queryParams, (err, bags) => {
    if (err) {
      console.error('Error retrieving bag details:', err);
      return res.status(500).send('Error retrieving bag details.');
    }

    db.query(partnerQuery, (err, partners) => {
      if (err) {
        console.error('Error retrieving partner details:', err);
        return res.status(500).send('Error retrieving partner details.');
      }

      // Render the dashboard with both bags and partners
      res.render('user/dashboard', {
        userId,
        bags,
        partners,
        sortBy,
        partnerName,
      });
    });
  });
});


app.get('/user/viewBag/:id', isAuthenticated_user, validateReferrer, (req, res) => {
  const userId = req.session.user.id; // Assuming session stores the user ID
  const bagId = req.params.id;

  const query = `SELECT * FROM bag_partner_view WHERE bagId = ?`;

  db.query(query, [bagId], (err, result) => {
    if (err) {
      console.error('Error retrieving bag details:', err);
      return res.status(500).send('Error retrieving bag details.');
    }

    if (result.length === 0) {
      return res.status(404).send('Bag not found.');
    }

    res.render('user/viewBag', { userId, bag: result[0] }); // Pass only the first row as bag
  });
});



app.get('/user/checkout/:id', isAuthenticated_user, validateReferrer, (req, res) => {
  const userId = req.session.user.id; // Assuming session stores the user ID
  const bagId = req.params.id;

  const query = `SELECT * FROM bag_partner_view WHERE bagId = ?`;

  db.query(query, [bagId], (err, result) => {
    if (err) {
      console.error('Error retrieving bag details:', err);
      return res.status(500).send('Error retrieving bag details.');
    }

    if (result.length === 0) {
      return res.status(404).send('Bag not found.');
    }

    res.render('user/checkout', { userId, bag: result[0] }); // Pass only the first row as bag
  });
});


app.post('/order', (req, res) => {
  const {  bag_id, partner_id, user_id, quantity, total_price } = req.body;

  // Query to insert into 'orders' table
  const orderQuery = `
      INSERT INTO orders (status, orderQuantity, orderCode, totalPrice, addedAt, bag_id, user_id, partner_id)
      VALUES ('reserved', ?, ?, ?, NOW(), ?, ?, ?)
  `;

  const orderCode = `#${Math.floor(10000 + Math.random() * 90000)}`; // Example order code

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Transaction error.');
    }

    // Step 1: Insert into 'orders' table
    db.query(orderQuery, [quantity, orderCode, total_price, bag_id, user_id, partner_id], (err, result) => {
      if (err) {
        console.error(err);
        return db.rollback(() => {
          res.status(500).send('Error placing order.');
        });
      }

      // Step 2: Update the 'bags' table to decrease quantity
      const updateBagQuery = `
          UPDATE bags
          SET quantity = quantity - ?
          WHERE id = ? AND quantity >= ?;
      `;

      db.query(updateBagQuery, [quantity, bag_id, quantity], (err, updateResult) => {
        if (err || updateResult.affectedRows === 0) {
          console.error(err || 'Not enough quantity in stock.');
          return db.rollback(() => {
            res.status(400).send('Error: Not enough quantity in stock.');
          });
        }

        // Commit transaction
        db.commit((err) => {
          if (err) {
            console.error(err);
            return db.rollback(() => {
              res.status(500).send('Transaction commit error.');
            });
          }

          res.redirect(`/user/orders/${user_id}`); // Redirect to a confirmation page
        });
      });
    });
  });
});


app.get('/user/Orders/:userId', isAuthenticated_user, isAuthorized_user, (req, res) => {

  const userId = req.params.userId;
  const name = req.session.user.name;



  let query = `SELECT * FROM order_details WHERE user_name IN (
            SELECT firstName FROM users WHERE id = ?
        )`;


  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving bag details.');
    }




    res.render('user/viewOrders', { userId, name, order: result });
  });



});



app.get('/user/Order/:id', isAuthenticated_user, (req, res) => {

  const orderId = req.params.id;
  const userId = req.session.user.id;



  let query = ` 
 SELECT * FROM single_order_details WHERE order_id = ?
  `;


  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving bag details.');
    }




    res.render('user/viewOrder', { orderId, userId, order: result[0] });
  });



});


// Handle "Picked Up" status
app.post('/order/pickedUp/:orderId', (req, res) => {
  const { orderId } = req.params;
  const userId = req.session.user.id;

  if (!orderId) {
    return res.status(400).send('Order ID is required.');
  }

  // Generate an invoice number, could be more complex if needed
  const invoiceNumber = `INV-${orderId}-${Date.now()}`;

  // SQL transaction to update status and insert into invoices table
  const queryUpdateStatus = 'UPDATE orders SET status = "picked up" WHERE id = ?';

  // Insert invoice into invoices table
  const queryInsertInvoice = `
    INSERT INTO invoices (invoice_number,order_id, partner_id, amount, status, issued_at, due_date, created_at, updated_at)
    SELECT ?,id, partner_id, totalPrice, 'unpaid', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()
    FROM orders WHERE id = ?;
  `;

  // Start by updating the order status
  db.query(queryUpdateStatus, [orderId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to update order status.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Order not found.');
    }

    // Now insert the invoice record
    db.query(queryInsertInvoice, [invoiceNumber, orderId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to create invoice.');
      }

      req.session.successMessage = "We Hope You Enjoy Your Food!";
      res.redirect(`/user/Orders/${userId}`); // Redirect to the user's orders page
    });
  });
});


// Handle "Cancelled" status
app.post('/order/cancelled/:orderId', (req, res) => {
  const { orderId } = req.params;
  const userId = req.session.user.id;

  if (!orderId) {
    return res.status(400).send('Order ID is required.');
  }

  // Fetch order details to retrieve the bag ID and order quantity
  const queryFetchOrder = 'SELECT bag_id, orderQuantity FROM orders WHERE id = ?';
  const queryUpdateStatus = 'UPDATE orders SET status = "cancelled" WHERE id = ?';
  const queryDeleteInvoice = 'DELETE FROM invoices WHERE order_id = ?'; // Delete the invoice associated with the order
  const queryUpdateBagQuantity = 'UPDATE bags SET quantity = quantity + ? WHERE id = ?';

  db.query(queryFetchOrder, [orderId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to fetch order details.');
    }

    if (results.length === 0) {
      return res.status(404).send('Order not found.');
    }

    const { bag_id, orderQuantity } = results[0];

    // Update order status
    db.query(queryUpdateStatus, [orderId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to update order status.');
      }

      // Return quantity to the bag
      db.query(queryUpdateBagQuantity, [orderQuantity, bag_id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to update bag quantity.');
        }

        // Delete the invoice associated with the canceled order
        db.query(queryDeleteInvoice, [orderId], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to delete invoice.');
          }

          req.session.failedMessage = "The order has been cancelled.";
          res.redirect(`/user/Orders/${userId}`); // Redirect to the user's orders page
        });

      });

    });

  });
});

app.get('/user/profile/:userId', isAuthenticated_user, isAuthorized_user, (req, res) => {
  const userId = req.params.userId; // Get the user ID from the route parameter

  const query = `SELECT * FROM users WHERE id = ?`; // Query to fetch user details

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving user profile.');
    }

    if (result.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.render('user/profile', { user: result[0], userId }); // Render profile view with user data
  });
});

app.get('/user/profileUpdate/:userId', isAuthenticated_user, isAuthorized_user, (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching partner data:', err);
      res.status(500).send('Error fetching partner data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Partner not found');
      return;
    }

    // Render the partner.ejs view with the partner's data
    res.render('user/putProfile', { profile: results[0], userId });
  });
});


// Route to update profile details
app.post('/profile/update/:userId', (req, res) => {
  const userId = req.params.userId; // Get the userId from the URL
  const { firstName, lastName, email, phone, gender, birthdate } = req.body;

  // Ensure session userId matches the URL userId to prevent unauthorized changes
  if (req.session.user.id !== parseInt(userId)) {
    return res.status(403).send('Unauthorized to update this profile.');
  }

  // Fetch current profile data for the user
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).send('Error fetching profile.');
    }

    if (results.length === 0) {
      return res.status(404).send('Profile not found.');
    }

    const currentProfile = results[0];

    // Use current values if no new value is provided
    const updatedProfile = {
      firstName: firstName || currentProfile.firstName,
      lastName: lastName || currentProfile.lastName,
      email: email || currentProfile.email,
      phone: phone || currentProfile.phone,
      gender: gender || currentProfile.gender,
      birthdate: birthdate || currentProfile.birthdate,
    };

    // Update the database with the new values
    db.query(
      'UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, gender = ?, birthdate = ? WHERE id = ?',
      [
        updatedProfile.firstName,
        updatedProfile.lastName,
        updatedProfile.email,
        updatedProfile.phone,
        updatedProfile.gender,
        updatedProfile.birthdate,
        userId, // Use userId to update the correct user's record
      ],
      (updateErr) => {
        if (updateErr) {
          console.error('Error updating profile:', updateErr);
          return res.status(500).send('Error updating profile.');
        }
        res.redirect(`/user/profile/${userId}`); // Redirect to profile page after update
      }
    );
  });
});

// Catch-all route for undefined paths
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found.' });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});