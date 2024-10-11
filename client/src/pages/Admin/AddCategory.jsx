import React, { useState } from 'react';

const CategoryComponent = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Formals', description: 'Product Brand', listed: true },
    { id: 2, name: 'Premium', description: 'Product Brand', listed: true },
    { id: 3, name: 'Casual', description: 'Product Brand', listed: true }
  ]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/5 bg-white shadow-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200">
                <span className="material-icons">grid_view</span>
                <span className="ml-2">Products</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200">
                <span className="material-icons">receipt</span>
                <span className="ml-2">Order List</span>
              </a>
            </li>
            {/* Add more sidebar items */}
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 bg-gray-200 text-gray-800 font-bold">
                <span className="material-icons">category</span>
                <span className="ml-2">Category</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Add Category</h2>
        
        {/* Form */}
        <div className="mb-8">
          <form className="bg-white p-6 rounded-lg shadow-lg flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
              <label className="block mb-2 text-sm font-semibold">Category Name:</label>
              <input
                type="text"
                placeholder="Enter Category Name"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label className="block mb-2 text-sm font-semibold">Category Description:</label>
              <input
                type="text"
                placeholder="Enter Category Description"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="w-full lg:w-auto bg-black text-white py-2 px-4 rounded-lg mt-4 lg:mt-0">
              Add Category
            </button>
          </form>
        </div>

        {/* Category Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Category Name</th>
                <th className="py-2 px-4 text-left">Category Description</th>
                <th className="py-2 px-4 text-left">List/Unlist</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="border-t py-2 px-4">{category.id}</td>
                  <td className="border-t py-2 px-4">{category.name}</td>
                  <td className="border-t py-2 px-4">{category.description}</td>
                  <td className="border-t py-2 px-4">
                    <button
                      onClick={() => {
                        setCategories((prev) =>
                          prev.map((cat) =>
                            cat.id === category.id ? { ...cat, listed: !cat.listed } : cat
                          )
                        );
                      }}
                      className={`${
                        category.listed ? 'bg-green-500' : 'bg-red-500'
                      } text-white py-1 px-4 rounded-full`}
                    >
                      {category.listed ? 'Listed' : 'Unlisted'}
                    </button>
                  </td>
                  <td className="border-t py-2 px-4">
                    <button className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded-lg">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CategoryComponent;
