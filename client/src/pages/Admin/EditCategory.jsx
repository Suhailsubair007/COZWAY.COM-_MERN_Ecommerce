import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../config/axiosConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditCategory() {
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/categories/edit/${categoryId}`
        );
        const category = response.data;
        setInitialValues({
          name: category.name,
          description: category.description,
        });
      } catch (error) {
        toast("Failed to fetch category details.");
        console.error(error);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

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

  const handleUpdateCategory = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.put(
        `/admin/edit-category/${categoryId}`,
        values
      );
      if (response.status === 200) {
        toast.success("Category updated successfully.");
        navigate("/admin/categories");
      } else {
        toast.error("Failed to update category. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating category.");
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Category</h2>
        <div className="mb-10">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleUpdateCategory}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-semibold"
                  >
                    Category Name:
                  </label>
                  <Field
                    as={Input}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Category Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-semibold"
                  >
                    Category Description:
                  </label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Enter Category Description"
                    rows={6}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full lg:w-32 self-end"
                >
                  Update Category
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  );
}
