import React from "react";
// Adjust the path to your logo file

function Header() {
  const categories = [
    {
      label: "Proteins",
      subcategories: [
        "Casein",
        "Slow-Release Proteins",
        "Egg Proteins",
        "Whey Protein",
        "Whey Protein Blend",
        "Whey Protein Concentrates",
        "Hydrolyzed Proteins",
        "Whey Protein Isolates",
      ],
    },
    {
        label: "Amino Acids",
        subcategories: [
          "L-Arginine",
          "Amino Acid Blend",
          "BCAA's (Branched-Chain Amino Acids)",
          "Meat-Based Amino Acids",
          "Glutamine",
          "BCAA's + Glutamine",
        ],
      },
    {
      label: "Carbohydrates",
      subcategories: [
        "High Glycemic Index",
        "Sequential Blend of Carbohydrates",
      ],
    },
    {
        label: "Creatine",
        subcategories: ["Creatine Monohydrate"],
      },
    {
      label: "Fatty Acids",
      subcategories: ["Omega 3", "Omega 3-6-9"],
    },
    {
      label: "Gainers (Weight Gain)",
      subcategories: ["Gainer 10% to 30%", "50/50 Gainer"],
    },
    {
      label: "Natural Anabolics",
      subcategories: [
        "Growth Hormone Pro-Hormone (GH)",
        "Pro-Testosterone",
        "ZMA",
        "Multi-Action",
      ],
    },
    {
      label: "Sports Drinks",
      subcategories: [
        "Ready-to-Drink Sports Drinks",
        "Pre-Workout",
        "Intra-Workout",
        "Post-Workout & Recovery",
      ],
    },
    {
      label: "Fat Burners",
      subcategories: [
        "L-Carnitine",
        "CLA",
        "Fat Burners",
        "Diuretics",
        "Thermogenics",
      ],
    },
    {
      label: "Vitamins & Minerals",
      subcategories: ["Minerals", "Multivitamins", "Joint Health"],
    },
    {
      label: "Bars",
      subcategories: ["Protein Bars", "Energy Bars"],
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      
        {/* Search Bar */}
    <div className="flex items-center justify-center mx-6">
    <div className="relative w-full max-w-md">
        <input
        type="text"
        placeholder="Search for products..."
        className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
  className="absolute bg-customBlue inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
  aria-label="Search"
>
  <span className="material-symbols-outlined text-xl text-white">search</span>
</button>

    </div>
     {/* Icons: Profile, Favorites, Cart */}
     <div className="flex items-center space-x-6">
        {/* Profile Icon */}
        <a href="/profile" className="text-gray-700 hover:text-blue-600 flex items-center">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
        </a>
        
        </div>

    </div>

      {/* Bottom Section */}
      <div className="bg-white-100 py-2">
        <nav className="container mx-auto flex justify-center items-center space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition text-xl font-bold">
            HOME
          </a>
          <div className="relative group">
            <a
              href="/categories"
              className="text-gray-700 hover:text-blue-600 transition text-xl font-bold"
            >
              CATEGORIES
            </a>
            <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg top-full left-0 w-[80vw] px-6 py-4">
              <div className="grid grid-cols-3 gap-4 max-w-screen-lg mx-auto">
                {categories.map((category, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {category.label}
                    </h3>
                    <ul className="space-y-1">
                      {category.subcategories.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={`/shop/${sub
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="block text-sm text-gray-700 hover:bg-blue-100 px-2 py-1 rounded"
                          >
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a href="/brands" className="text-gray-700 hover:text-blue-600 transition text-xl font-bold">
            BRANDS
          </a>
          <a href="/packs" className="text-gray-700 hover:text-blue-600 transition text-xl font-bold">
            PACKS
          </a>
          <a
            href="/clothing-accessories"
            className="text-gray-700 hover:text-blue-600 transition text-xl font-bold"
          >
            CLOTHING AND ACCESSORIES
          </a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600 transition text-xl font-bold">
            CONTACT
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
