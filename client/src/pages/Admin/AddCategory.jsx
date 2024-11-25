import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../config/axiosConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CategoryComponent = () => {
  const [list, SetList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await axiosInstance.get("/admin/categories");
        SetList(categories.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const handleAddCategory = async (values, { resetForm }) => {
    try {
      const response = await axiosInstance.post("/admin/add_category", {
        name: values.name,
        description: values.description,
      });

      if (response.status === 201) {
        toast.success("Category added successfully!");
        resetForm();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Category with this name already exists.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      const updatedStatus = !category.is_active;
      await axiosInstance.patch(`/admin/categories/${category._id}`, {
        is_active: updatedStatus,
      });
      SetList((prev) =>
        prev.map((cat) =>
          cat._id === category._id ? { ...cat, is_active: updatedStatus } : cat
        )
      );
      toast.success(
        `Category ${updatedStatus ? "listed" : "unlisted"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update category status.");
    }
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed")
      .required("Category Name is required"),
    description: Yup.string()
      .trim()
      .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed")
      .required("Category Description is required"),
  });

  return (
    <div className="mt-4 ">
      <nav className="pl-5 flex items-center gap-2 text-sm text-black mb-4">
        <a
          href="/admin/dashboard"
          className="flex items-center hover:text-gray-900"
        >
          <Home className="h-4 w-4" />
          <span className="ml-1">Dashboard</span>
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/admin/categories" className="hover:text-gray-900">
          Category Management
        </a>
      </nav>
      <div className="flex h-screen bg-gray-100">
        <main className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-6">Add Category</h2>

          {/* Form */}
          <div className="mb-10">
            <Formik
              initialValues={{ name: "", description: "" }}
              validationSchema={validationSchema}
              onSubmit={handleAddCategory}
            >
              {({ isSubmitting }) => (
                <Form className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-semibold">
                      Category Name:
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter Category Name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-semibold">
                      Category Description:
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Enter Category Description"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={6}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full lg:w-32 bg-black hover:bg-gray-600 text-white py-2 px-4 rounded-lg mt-4 text-sm self-end"
                  >
                    Add Category
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Category Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Category Name</th>
                  <th className="py-2 px-4 text-left">Category Description</th>
                  <th className="py-2 px-4 text-left">List/Unlist</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((category) => (
                  <tr key={category._id}>
                    <td className="border-t py-2 px-4">{category.name}</td>
                    <td className="border-t py-2 px-4">
                      {category.description}
                    </td>
                    <td className="border-t py-2 px-4">
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={() => toggleCategoryStatus(category)}
                      />
                    </td>
                    <td className="border-t py-2 px-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/categories/edit/${category._id}`)
                        }
                        className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-lg text-sm"
                      >
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
    </div>
  );
};

export default CategoryComponent;
