// routes/pageRoutes.js
const express = require('express');
const { settings } = require('node:cluster');
const router = express.Router();

// Category page data
const categoryData = {
  'water-ibc-tanks': {
    pageTitle: 'Water IBC Tanks',
    pageSubtitle: 'Premium quality 1000 liter water IBC tanks for farms, homes, businesses & industrial water storage across Pakistan.',
    iconClass: 'bi-droplet-fill',
    metaTitle: 'Water IBC Tanks Pakistan | 1000 Liter Water Tank - IBC Tank Store',
    metaDescription: 'Buy premium 1000 liter water IBC tanks in Pakistan. Perfect for farm irrigation, rainwater harvesting, and commercial water storage. Best prices with nationwide delivery.',
    metaKeywords: 'Water IBC Tank Pakistan, 1000 Liter Water Tank, Rainwater Storage Tank, Water Storage Tank Pakistan, IBC Water Tank Lahore',
    benefits: [
      { title: 'Food-Grade HDPE Material', desc: 'Made from high-density polyethylene, safe for potable water storage and drinking water applications.' },
      { title: 'UV Resistant', desc: 'Designed to withstand Pakistan\'s harsh sunlight and extreme temperatures without degrading.' },
      { title: 'Leak-Proof Design', desc: 'Comes with a secure lid and tested valve system to prevent leaks and contamination.' },
      { title: 'Easy to Clean & Maintain', desc: 'Smooth inner surface prevents algae growth and makes cleaning simple with basic household cleaners.' },
      { title: 'Stackable & Space Efficient', desc: 'Square design allows easy stacking and efficient use of storage space in warehouses and farms.' },
      { title: 'Heavy-Duty Steel Cage', desc: 'Galvanized steel cage provides structural support and allows easy transport with forklifts.' }
    ],
    applications: [
      { icon: 'droplet-fill', title: 'Farm Irrigation', desc: 'Store and distribute water for drip irrigation systems on agricultural farms in Punjab and Sindh.' },
      { icon: 'cloud-rain-fill', title: 'Rainwater Harvesting', desc: 'Collect and store rainwater for household and agricultural use during monsoon season.' },
      { icon: 'house-fill', title: 'Home Water Storage', desc: 'Reliable backup water storage for homes, especially in areas with inconsistent water supply.' },
      { icon: 'building', title: 'Commercial Buildings', desc: 'Water storage solutions for offices, shopping centers, and apartment buildings.' },
      { icon: 'factory', title: 'Industrial Use', desc: 'Process water storage for manufacturing facilities and industrial operations.' },
      { icon: 'egg-fill', title: 'Fish Farms', desc: 'Fresh water reservoirs for aquaculture and fish farming operations.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'Food-Grade HDPE (High-Density Polyethylene)' },
      { label: 'Cage Material', value: 'Galvanized Steel' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 60 kg' },
      { label: 'Max Temperature', value: 'Up to 70°C (158°F)' },
      { label: 'Forklift Access', value: '4-way entry on steel cage' },
      { label: 'Certification', value: 'UN Approved, FDA Compliant' },
      { label: 'Condition', value: 'New / Refurbished Available' },
      { label: 'Valve Type', value: '2-inch ball valve with dust cap' }
    ],
    faqs: [
      { q: 'Can I use a water IBC tank for drinking water?', a: 'Yes, our food-grade water IBC tanks are made from FDA-approved HDPE material and are completely safe for storing drinking water and other consumable liquids.' },
      { q: 'How long do water IBC tanks last?', a: 'With proper care and maintenance, water IBC tanks can last 15-20 years. UV-resistant models are designed for outdoor use in Pakistan\'s climate.' },
      { q: 'Do you offer bulk discounts for farm irrigation projects?', a: 'Yes, we offer significant bulk discounts for agricultural orders. Contact us with your requirements and we\'ll provide competitive pricing.' },
      { q: 'Can I stack water IBC tanks?', a: 'Yes, when empty or properly supported, IBC tanks can be stacked up to 2-3 high depending on the weight and support structure. Contact us for stacking guidelines.' }
    ]
  },
  'chemical-ibc-tanks': {
    pageTitle: 'Chemical IBC Tanks',
    pageSubtitle: 'Chemical-resistant IBC tanks designed for safe storage and transport of hazardous chemicals, acids, and industrial fluids.',
    iconClass: 'bi-droplet-half',
    metaTitle: 'Chemical IBC Tanks Pakistan | Chemical Storage Tanks - IBC Tank Store',
    metaDescription: 'Buy chemical-resistant IBC tanks in Pakistan. Safely store acids, solvents, and industrial chemicals. UN-approved chemical storage tanks with nationwide delivery.',
    metaKeywords: 'Chemical IBC Tank Pakistan, Chemical Storage Tank, Industrial Chemical Tank, Acid Storage Tank Pakistan, Chemical Tank Lahore',
    benefits: [
      { title: 'Chemical Resistant HDPE', desc: 'Constructed from chemical-resistant polyethylene that won\'t react with most acids, solvents, and industrial chemicals.' },
      { title: 'UN Approved', desc: 'Meets UN international standards for the storage and transport of hazardous materials and dangerous goods.' },
      { title: 'Tamper-Proof Seals', desc: 'Comes with security seals and locking mechanisms to prevent unauthorized access and contamination.' },
      { title: 'Secondary Containment', desc: 'Compatible with spill containment pallets for added environmental protection and regulatory compliance.' },
      { title: 'Chemical Compatibility Tested', desc: 'Each tank is tested for compatibility with a wide range of chemicals before being offered for sale.' },
      { title: 'Full Documentation', desc: 'Includes chemical compatibility charts, safety data sheets, and compliance certificates.' }
    ],
    applications: [
      { icon: 'droplet-half', title: 'Chemical Manufacturing', desc: 'Store raw chemicals and finished chemical products in manufacturing plants across Pakistan.' },
      { icon: 'building', title: 'Pharmaceutical Industry', desc: 'Chemical intermediate storage for pharmaceutical production facilities.' },
      { icon: 'water', title: 'Water Treatment', desc: 'Store treatment chemicals like chlorine, alum, and pH adjusters at water treatment plants.' },
      { icon: 'brush-fill', title: 'Paint & Coatings', desc: 'Storage for paint thinners, solvents, and coating chemicals in paint manufacturing.' },
      { icon: 'truck', title: 'Chemical Transport', desc: 'Safe transport of hazardous chemicals between facilities and to customer locations.' },
      { icon: 'recycle', title: 'Waste Management', desc: 'Temporary storage of chemical waste before proper disposal and recycling.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'Chemical-Resistant HDPE' },
      { label: 'Cage Material', value: 'Galvanized Steel (Heavy Duty)' },
      { label: 'UN Rating', value: 'UN 31HA1 / UN 31HA2' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 65 kg' },
      { label: 'Max SG (Specific Gravity)', value: 'Up to 1.9 (depending on chemical)' },
      { label: 'Valve Type', value: 'Chemical-resistant ball valve' },
      { label: 'Certification', value: 'UN Approved, DOT Compliant' },
      { label: 'Condition', value: 'New / Refurbished Available' }
    ],
    faqs: [
      { q: 'What chemicals can I store in these IBC tanks?', a: 'Our chemical IBC tanks are compatible with a wide range of chemicals including acids (hydrochloric, sulfuric), solvents, alkalis, and most industrial chemicals. We provide a detailed chemical compatibility chart with each purchase.' },
      { q: 'Are chemical IBC tanks UN approved?', a: 'Yes, all our chemical IBC tanks meet UN international standards for hazardous material storage and transport. They come with full UN certification documentation.' },
      { q: 'Do you offer chemical compatibility consultation?', a: 'Yes, our technical team can help you select the right tank based on the specific chemicals you need to store. Contact us with your chemical specifications.' },
      { q: 'Can I use a used chemical IBC tank for new chemicals?', a: 'All our refurbished chemical tanks undergo thorough decontamination and testing. We guarantee they are safe for their rated chemical compatibility. However, for highly sensitive applications, we recommend new tanks.' }
    ]
  },
  'fertilizer-ibc-tanks': {
    pageTitle: 'Fertilizer IBC Tanks',
    pageSubtitle: 'Dedicated IBC tanks for fertilizer storage — ideal for agriculture businesses, fertilizer distributors, and farming operations.',
    iconClass: 'bi-flower1',
    metaTitle: 'Fertilizer IBC Tanks Pakistan | Agriculture Fertilizer Storage - IBC Tank Store',
    metaDescription: 'Buy fertilizer IBC tanks in Pakistan. Store liquid fertilizers, NPK solutions & agricultural chemicals safely. Bulk discounts for farms. Nationwide delivery.',
    metaKeywords: 'Fertilizer IBC Tank Pakistan, Liquid Fertilizer Storage, Agriculture Tank, NPK Storage Tank, Farm Tank Pakistan',
    benefits: [
      { title: 'Fertilizer-Resistant Material', desc: 'Specially selected HDPE that resists corrosion from nitrogen, phosphorus, and potassium-based liquid fertilizers.' },
      { title: 'Easy Dispensing Valve', desc: 'Comes with a precision ball valve for accurate measurement and easy dispensing of liquid fertilizers.' },
      { title: 'UV-Stabilized for Outdoor Use', desc: 'Designed to withstand direct sunlight exposure common on farms throughout Pakistan.' },
      { title: 'Forklift Compatible', desc: 'Standard steel cage with 4-way forklift access for easy transport around the farm or warehouse.' },
      { title: 'Cost-Effective Bulk Storage', desc: 'Store large quantities of fertilizer at lower cost per liter compared to original manufacturer containers.' },
      { title: 'Reusability', desc: 'Can be cleaned and reused multiple seasons, reducing waste and long-term storage costs.' }
    ],
    applications: [
      { icon: 'flower1', title: 'Farm Fertilizer Storage', desc: 'Store bulk liquid fertilizers on farms for drip irrigation and fertigation systems.' },
      { icon: 'shop', title: 'Fertilizer Distributors', desc: 'Wholesale storage for fertilizer suppliers and agricultural input dealers.' },
      { icon: 'grid-3x3-gap', title: 'Greenhouse Operations', desc: 'Nutrient solution storage for commercial greenhouses and nurseries.' },
      { icon: 'water', title: 'Fertigation Systems', desc: 'Integrated storage for fertigation systems combining irrigation and fertilization.' },
      { icon: 'cash-stack', title: 'Agricultural Cooperatives', desc: 'Shared fertilizer storage for farming cooperatives and community farms.' },
      { icon: 'truck', title: 'Fertilizer Transport', desc: 'Safe transport of liquid fertilizers from suppliers to farms and retailers.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'UV-Stabilized HDPE' },
      { label: 'Cage Material', value: 'Galvanized Steel' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 60 kg' },
      { label: 'UV Protection', value: 'Yes, UV-8 stabilized' },
      { label: 'Valve Type', value: '2-inch precision ball valve' },
      { label: 'Lid Type', value: 'Screw-on with gasket seal' },
      { label: 'Condition', value: 'New / Refurbished Available' },
      { label: 'Compatible Fertilizers', value: 'NPK, Urea, DAP, SOP Solutions' }
    ],
    faqs: [
      { q: 'Can I store liquid fertilizer in an IBC tank?', a: 'Yes, our fertilizer IBC tanks are specifically designed for liquid fertilizer storage. They are compatible with NPK solutions, urea, DAP, and other common liquid fertilizers used in Pakistan.' },
      { q: 'How do I clean a fertilizer IBC tank between seasons?', a: 'Rinse thoroughly with clean water between different fertilizer types. For seasonal storage, flush with water and allow to dry completely. Our tanks have smooth inner walls that make cleaning easy.' },
      { q: 'Are these tanks suitable for drip irrigation systems?', a: 'Yes, our fertilizer IBC tanks are perfect for drip irrigation and fertigation systems. The 2-inch valve connects easily to standard irrigation equipment.' },
      { q: 'Do you offer bulk pricing for agricultural cooperatives?', a: 'Yes, we offer special bulk pricing for farming cooperatives, agricultural businesses, and large-scale farm operations. Contact us for a custom quote.' }
    ]
  },
  'food-grade-ibc-tanks': {
    pageTitle: 'Food Grade IBC Tanks',
    pageSubtitle: 'FDA-approved food-grade IBC tanks safe for storing juices, oils, syrups, dairy products, and other consumable liquids.',
    iconClass: 'bi-cup-hot-fill',
    metaTitle: 'Food Grade IBC Tanks Pakistan | FDA Approved Storage - IBC Tank Store',
    metaDescription: 'Buy FDA-approved food grade IBC tanks in Pakistan. Safe for juices, oils, syrups, dairy & edible liquids. Premium quality with nationwide delivery.',
    metaKeywords: 'Food Grade IBC Tank Pakistan, FDA Approved Tank, Juice Storage Tank, Edible Liquid Storage, Food Safe IBC Tank',
    benefits: [
      { title: 'FDA-Approved Material', desc: 'Made from FDA-approved food-grade HDPE, completely safe for storing consumable liquids and food products.' },
      { title: 'Taste & Odor Neutral', desc: 'Special material formulation ensures no taste or odor transfer to stored food products.' },
      { title: 'Easy to Sanitize', desc: 'Smooth, non-porous interior surface can be easily sanitized using standard CIP (Clean-in-Place) procedures.' },
      { title: 'Tamper-Evident Seals', desc: 'Comes with tamper-evident lid seals to ensure product integrity and food safety compliance.' },
      { title: 'Traceable Materials', desc: 'Full material traceability and batch documentation for food safety audits and compliance.' },
      { title: 'Stackable for Warehousing', desc: 'Efficient square design for maximum warehouse space utilization in food processing facilities.' }
    ],
    applications: [
      { icon: 'cup-hot-fill', title: 'Juice & Beverage Industry', desc: 'Store fruit juices, syrups, soft drink concentrates, and beverage ingredients.' },
      { icon: 'egg-fill', title: 'Dairy & Edible Oils', desc: 'Storage for milk, cream, cooking oils, ghee, and other dairy-based liquids.' },
      { icon: 'flower1', title: 'Honey & Syrup Storage', desc: 'Ideal for honey producers and syrup manufacturers for bulk storage and transport.' },
      { icon: 'shop', title: 'Food Processing Plants', desc: 'Ingredient storage for commercial food processing and manufacturing facilities.' },
      { icon: 'truck', title: 'Food Distribution', desc: 'Safe transport of food-grade liquids from production to distribution centers.' },
      { icon: 'building', title: 'Restaurants & Hotels', desc: 'Bulk storage of cooking oils and food ingredients for large food service operations.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'FDA-Approved Food-Grade HDPE' },
      { label: 'Cage Material', value: 'Galvanized Steel' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 60 kg' },
      { label: 'Certification', value: 'FDA 21 CFR 177.1520 Compliant' },
      { label: 'Max Temperature', value: 'Up to 70°C (Pasteurization Compatible)' },
      { label: 'Lid Type', value: 'Screw-on with food-grade gasket' },
      { label: 'Condition', value: 'New Only (Food Grade)' },
      { label: 'Valve Type', value: 'Sanitary butterfly valve' }
    ],
    faqs: [
      { q: 'Is a food grade IBC tank safe for drinking water?', a: 'Yes, food grade IBC tanks are the safest option for drinking water storage. They meet FDA standards and are designed for consumable liquids.' },
      { q: 'What is the difference between regular and food grade IBC tanks?', a: 'Food grade tanks use FDA-approved materials, have sanitary valves, and undergo additional quality control. They ensure no chemical or taste contamination of food products.' },
      { q: 'Can I store cooking oil in a food grade IBC tank?', a: 'Yes, food grade IBC tanks are ideal for storing cooking oils, ghee, and other edible fats. They are commonly used by restaurants, hotels, and food manufacturers in Pakistan.' },
      { q: 'Do food grade IBC tanks come with certificates?', a: 'Yes, all our food grade tanks come with FDA compliance certificates, material traceability documentation, and batch quality reports.' }
    ]
  },
  'used-ibc-tanks': {
    pageTitle: 'Used IBC Tanks',
    pageSubtitle: 'Professionally refurbished and inspected used IBC tanks at affordable prices. Same quality, better value for budget-conscious buyers.',
    iconClass: 'bi-recycle',
    metaTitle: 'Used IBC Tanks Pakistan | Refurbished IBC Tanks - IBC Tank Store',
    metaDescription: 'Buy affordable used/refurbished IBC tanks in Pakistan. Professionally inspected, cleaned & certified. Save 40-60% compared to new tanks. Nationwide delivery.',
    metaKeywords: 'Used IBC Tank Pakistan, Refurbished IBC Tank, Cheap IBC Tank, Second Hand IBC Tank, Affordable IBC Tank Lahore',
    benefits: [
      { title: 'Save 40-60%', desc: 'Get the same reliable IBC tank at a fraction of the cost of new tanks. Perfect for budget-conscious buyers.' },
      { title: 'Professionally Inspected', desc: 'Every tank undergoes a 12-point inspection covering structural integrity, valve function, and chemical compatibility.' },
      { title: 'Thoroughly Cleaned', desc: 'All tanks are professionally cleaned, decontaminated, and sanitized before being offered for sale.' },
      { title: 'Quality Guarantee', desc: 'Comes with a 90-day quality guarantee. If you\'re not satisfied, we\'ll replace the tank or provide a full refund.' },
      { title: 'Various Conditions', desc: 'Choose from light-use, medium-use, and heavy-use grades to match your budget and application needs.' },
      { title: 'Eco-Friendly Choice', desc: 'By choosing refurbished tanks, you reduce plastic waste and contribute to environmental sustainability.' }
    ],
    applications: [
      { icon: 'droplet-fill', title: 'Water Storage', desc: 'Affordable water storage for farms, homes, and businesses that don\'t need food-grade tanks.' },
      { icon: 'flower1', title: 'Agriculture', desc: 'Cost-effective fertilizer and irrigation water storage for small and medium farms.' },
      { icon: 'factory', title: 'Industrial Use', desc: 'General industrial liquid storage where new tank certification is not required.' },
      { icon: 'recycle', title: 'Rainwater Harvesting', desc: 'Budget-friendly rainwater collection systems for homes and communities.' },
      { icon: 'brush-fill', title: 'Paint & Non-Food Use', desc: 'Store non-food liquids like paint, cleaning solutions, and general chemicals.' },
      { icon: 'house-fill', title: 'Residential Backup', desc: 'Emergency water storage backup for homes with unreliable water supply.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'HDPE (Previously used, professionally cleaned)' },
      { label: 'Cage Material', value: 'Galvanized Steel (Rust-treated)' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 55-65 kg' },
      { label: 'Condition Grades', value: 'Grade A (Light Use), Grade B (Medium), Grade C (Heavy)' },
      { label: 'Inspection', value: '12-point quality inspection' },
      { label: 'Warranty', value: '90-day quality guarantee' },
      { label: 'Previous Contents', value: 'Water, Food Products, Non-hazardous Chemicals Only' },
      { label: 'Valve', value: 'Replaced with new valve (included)' }
    ],
    faqs: [
      { q: 'Are used IBC tanks safe to use?', a: 'Yes, all our used IBC tanks undergo a rigorous 12-point inspection and professional decontamination process. We only accept tanks that previously held water, food products, or non-hazardous materials.' },
      { q: 'How much can I save compared to new tanks?', a: 'Our used IBC tanks typically cost 40-60% less than new tanks. The exact savings depend on the condition grade you choose.' },
      { q: 'What condition grades do you offer?', a: 'We offer three grades: Grade A (lightly used, near-new condition), Grade B (medium use, minor cosmetic wear), and Grade C (heavier use, functional with visible wear).' },
      { q: 'What if the used tank has issues after purchase?', a: 'All used tanks come with a 90-day quality guarantee. If you experience any issues, we will replace the tank or provide a full refund.' }
    ]
  },
  'diesel-storage-tanks': {
    pageTitle: 'Diesel Storage Tanks',
    pageSubtitle: 'Reliable diesel and fuel storage IBC tanks for factories, generators, construction sites, and fleet operations across Pakistan.',
    iconClass: 'bi-fuel-pump',
    metaTitle: 'Diesel Storage Tanks Pakistan | Fuel Storage IBC Tanks - IBC Tank Store',
    metaDescription: 'Buy diesel and fuel storage IBC tanks in Pakistan. Safe diesel storage for generators, factories & construction sites. Competitive prices with nationwide delivery.',
    metaKeywords: 'Diesel Storage Tank Pakistan, Fuel Storage Tank, Generator Fuel Tank, Industrial Fuel Tank, Diesel Tank Lahore',
    benefits: [
      { title: 'Fuel-Resistant Material', desc: 'Made from diesel and fuel-compatible HDPE that won\'t degrade or react with petroleum products.' },
      { title: 'Secure Storage', desc: 'Lockable lid and valve mechanism prevents fuel theft and unauthorized access.' },
      { title: 'Spill Containment', desc: 'Compatible with our spill containment pallets to prevent environmental contamination.' },
      { title: 'Portable Design', desc: 'Forklift-compatible steel cage allows easy transport between sites and fueling locations.' },
      { title: 'Fire-Resistant Cage', desc: 'Galvanized steel cage provides fire resistance and structural integrity during storage.' },
      { title: 'Cost-Effective Solution', desc: 'Much cheaper than traditional steel fuel tanks while providing the same storage capacity.' }
    ],
    applications: [
      { icon: 'lightning-charge-fill', title: 'Generator Fuel Storage', desc: 'Store diesel for backup generators at hospitals, data centers, and commercial buildings.' },
      { icon: 'building', title: 'Factory Operations', desc: 'On-site diesel storage for factory machinery, forklifts, and heating systems.' },
      { icon: 'construction', title: 'Construction Sites', desc: 'Portable diesel storage for construction equipment, excavators, and site generators.' },
      { icon: 'truck', title: 'Fleet Refueling', desc: 'Mobile refueling stations for trucking companies and transport fleets.' },
      { icon: 'gear-fill', title: 'Agricultural Machinery', desc: 'Diesel storage for tractors, harvesters, and farm equipment in rural areas.' },
      { icon: 'hdd-stack', title: 'Telecom Towers', desc: 'Diesel backup fuel storage for telecom tower sites in remote locations.' }
    ],
    specs: [
      { label: 'Capacity', value: '1000 Liters (1 Cubic Meter)' },
      { label: 'Material', value: 'Fuel-Resistant HDPE' },
      { label: 'Cage Material', value: 'Galvanized Steel (Fire-Resistant)' },
      { label: 'Dimensions (L×W×H)', value: '1200mm × 1000mm × 1160mm' },
      { label: 'Weight (Empty)', value: 'Approximately 65 kg' },
      { label: 'Compatible Fuels', value: 'Diesel, Kerosene, Light Oils' },
      { label: 'Valve Type', value: 'Lockable fuel-grade ball valve' },
      { label: 'Spill Prevention', value: 'Compatible with containment pallets' },
      { label: 'Condition', value: 'New / Refurbished Available' },
      { label: 'Safety Feature', value: 'Lockable lid and valve' }
    ],
    faqs: [
      { q: 'Can I store diesel fuel in an IBC tank?', a: 'Yes, our diesel storage IBC tanks are made from fuel-resistant HDPE that is safe for storing diesel, kerosene, and other light petroleum products.' },
      { q: 'Is it legal to store diesel in Pakistan?', a: 'Yes, storing diesel for your own business use (generators, machinery, etc.) is legal. However, large-scale fuel storage may require specific permits. Contact us for guidance.' },
      { q: 'How do I prevent diesel theft from the tank?', a: 'Our diesel IBC tanks come with lockable lids and valve mechanisms. We also recommend using them in secure, enclosed areas for additional protection.' },
      { q: 'Can diesel IBC tanks be transported when full?', a: 'Filled IBC tanks should only be transported on flatbed trucks with proper securing. The total weight when full is approximately 850 kg, so ensure your vehicle can handle the load.' }
    ]
  }
};

// Category Pages
Object.keys(categoryData).forEach(function(slug) {
  router.get('/' + slug, function(req, res) {
    var data = categoryData[slug];
    res.render('public/products/_category-page', Object.assign({
      title: data.pageTitle,
      viewPage: slug,
      path: '/' + slug,
      canonicalPath: '/' + slug
    }, data));
  });
});

// About Page
router.get('/about', function(req, res) {
  res.render('public/pages/about', {
    title: 'About Us',
    path: '/about',
    canonicalPath: '/about',
    metaTitle: 'About Us | IBC Tank Store - Pakistan\'s Leading IBC Tank Supplier',
    metaDescription: 'Learn about IBC Tank Store - Pakistan\'s trusted supplier of IBC tanks since 2020. Our story, mission, and commitment to quality and customer satisfaction.'
  });
});

// Contact Page
router.get('/contact', function(req, res) {
  res.render('public/pages/contact', {
    title: 'Contact Us',
    path: '/contact',
    canonicalPath: '/contact',
    metaTitle: 'Contact Us | IBC Tank Store - Get a Free Quote',
    metaDescription: `Contact IBC Tank Store for IBC tank inquiries, bulk orders, and quotes. Phone: ${res.locals.settings.contact_number}. WhatsApp available. Lahore, Pakistan.`
  });
});

router.get('/faqs', function(req, res) {
  res.render('public/pages/faq', { title: 'FAQs' });
});

router.get('/privacy-policy', function(req, res) {
  res.render('public/pages/privacy', { title: 'Privacy Policy' });
});

router.get('/terms', function(req, res) {
  res.render('public/pages/terms', { title: 'Terms and Conditions' });
});

router.get('/order-tracking', function(req, res) {
  res.render('public/pages/track-order', { title: 'Order Tracking' });
});

router.get('/returns-and-refunds', function(req, res) {
  res.render('public/pages/return-refund-policy', { title: 'Returns and Refunds' });
});

router.get('/payment-methods', function(req, res) {
  res.render('public/pages/payment', { title: 'Payment Methods' });
});

router.get('/shipping-and-delivery', function(req, res) {
  res.render('public/pages/shipping-and-delivery', { title: 'Shipping and Delivery' });
});

router.get('/order-cancellation-policy', function(req, res) {
  res.render('public/pages/order-cancellation-policy', { title: 'Order Cancellation Policy' });
});

module.exports = router;