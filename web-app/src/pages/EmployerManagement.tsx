import React, { useState, useEffect } from "react";
import { Edit, Trash, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Employer,
  EmployerInput,
  useEmployerService,
} from "../api/crudEmployer";

const EmployerManagement = () => {
  const employerService = useEmployerService();

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editEmployerId, setEditEmployerId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEmployerId, setDeleteEmployerId] = useState<number | null>(null);

  // Form states
  const [form, setForm] = useState<EmployerInput>({
    name: "",
    contact_number: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    addr_long: 0,
    addr_lat: 0,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Data states
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    employerService
      .getEmployers()
      .then((list) => setEmployers(Array.isArray(list) ? list : []))
      .catch(() => setEmployers([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort employers by search query and ID
  const filteredSortedEmployers = [...employers]
    .filter((item) => {
      const name = item.name.toLowerCase();
      const idStr = String(item.id);
      return (
        name.includes(searchQuery.toLowerCase()) ||
        idStr.includes(searchQuery.trim())
      );
    })
    .sort((a, b) => a.id - b.id);

  // Dialog handlers
  const handleAddEmployer = () => {
    setIsEditMode(false);
    setEditEmployerId(null);
    resetForm();
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleEditEmployer = async (employer: Employer) => {
    try {
      const fullEmployer = await employerService.getEmployerById(employer.id);
      setEditEmployerId(fullEmployer.id);
      setIsEditMode(true);
      setForm({
        name: fullEmployer.name || "",
        contact_number: fullEmployer.contact_number || "",
        address_line1: fullEmployer.address_line1 || "",
        address_line2: fullEmployer.address_line2 || "",
        address_line3: fullEmployer.address_line3 || "",
        addr_long: fullEmployer.addr_long || 0,
        addr_lat: fullEmployer.addr_lat || 0,
      });
      setFormErrors({});
      setIsDialogOpen(true);
    } catch (error) {
      alert("Failed to load employer data for editing.");
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditEmployerId(null);
    resetForm();
  };

  const handleDeleteEmployer = (id: number) => {
    setDeleteEmployerId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteEmployer = async () => {
    if (typeof deleteEmployerId !== "number" || isNaN(deleteEmployerId)) {
      return;
    }
    setLoading(true);
    try {
      await employerService.deleteEmployer(deleteEmployerId);
      setEmployers((prev) => prev.filter((emp) => emp.id !== deleteEmployerId));
      setIsDeleteDialogOpen(false);
      setDeleteEmployerId(null);
    } catch (err) {
      alert("Failed to delete employer. See console for details.");
      console.error(err);
    }
    setLoading(false);
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "addr_long" || name === "addr_lat" ? Number(value) : value,
    }));
  };

  const handleSubmitEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      setLoading(true);
      if (isEditMode && editEmployerId) {
        await employerService.updateEmployer(editEmployerId, form);
      } else {
        await employerService.createEmployer(form);
      }
      // Refresh employer list
      const list = await employerService.getEmployers();
      setEmployers(Array.isArray(list) ? list : []);
      setIsDialogOpen(false);
      setIsEditMode(false);
      setEditEmployerId(null);
      resetForm();
    } catch (err) {
      alert("Failed to save employer. See console for details.");
      console.error(err);
    }
    setLoading(false);
    setIsFormSubmitted(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      contact_number: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      addr_long: 0,
      addr_lat: 0,
    });
    setIsFormSubmitted(false);
  };

  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.contact_number.trim())
      errors.contact_number = "Contact number is required";
    if (!form.address_line1.trim())
      errors.address_line1 = "Address line 1 is required";
    if (!form.address_line3.trim())
      errors.address_line3 = "Address line 3 is required";
    if (!form.addr_long) errors.addr_long = "Longitude is required";
    if (!form.addr_lat) errors.addr_lat = "Latitude is required";
    return errors;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  Employer Management
                </h2>
              </div>
              <Button
                onClick={handleAddEmployer}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Employer
              </Button>
            </div>

            {/* Search and Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    className="pl-10 bg-white/80 backdrop-blur-sm shadow-sm border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Search employers by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-md">
                <p className="text-sm font-medium opacity-90">
                  Total Employers
                </p>
                <p className="text-2xl font-bold mt-1">{employers.length}</p>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableHead className="pl-16 w-1/5 font-semibold text-gray-700 text-left">
                      ID
                    </TableHead>
                    <TableHead className="pl-16 w-3/5 font-semibold text-gray-700 text-left">
                      NAME
                    </TableHead>
                    <TableHead className="pr-6 w-1/5 font-semibold text-gray-700 text-center">
                      ACTION
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredSortedEmployers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No employers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSortedEmployers.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <TableCell className="pl-16 font-medium text-gray-900 text-left w-1/5">
                          {item.id}
                        </TableCell>
                        <TableCell className="pl-16 text-gray-700 text-left w-3/5">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center w-1/5">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditEmployer(item)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit employer"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete employer"
                              onClick={() => handleDeleteEmployer(item.id)}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Employer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isEditMode ? "Edit Employer" : "Add New Employer"}
            </DialogTitle>
            <p className="text-gray-500 text-sm mt-1">
              {isEditMode
                ? "Update the employer details below"
                : "Fill in the details to add a new employer"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmitEmployer} className="mt-6">
            <div className="space-y-6">
              {/* Name */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.name && (
                  <span className="text-red-600 text-xs">
                    {formErrors.name}
                  </span>
                )}
              </div>
              {/* Contact Number */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="contact_number"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Number <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  value={form.contact_number}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.contact_number && (
                  <span className="text-red-600 text-xs">
                    {formErrors.contact_number}
                  </span>
                )}
              </div>
              {/* Address Line 1 */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="address_line1"
                  className="text-sm font-medium text-gray-700"
                >
                  Address Line 1 <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  value={form.address_line1}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.address_line1 && (
                  <span className="text-red-600 text-xs">
                    {formErrors.address_line1}
                  </span>
                )}
              </div>
              {/* Address Line 2 */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="address_line2"
                  className="text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  value={form.address_line2}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
              </div>
              {/* Address Line 3 */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="address_line3"
                  className="text-sm font-medium text-gray-700"
                >
                  Address Line 3 <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="address_line3"
                  name="address_line3"
                  value={form.address_line3}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.address_line3 && (
                  <span className="text-red-600 text-xs">
                    {formErrors.address_line3}
                  </span>
                )}
              </div>
              {/* Longitude */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="addr_long"
                  className="text-sm font-medium text-gray-700"
                >
                  Longitude <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="addr_long"
                  name="addr_long"
                  type="number"
                  value={form.addr_long}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.addr_long && (
                  <span className="text-red-600 text-xs">
                    {formErrors.addr_long}
                  </span>
                )}
              </div>
              {/* Latitude */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="addr_lat"
                  className="text-sm font-medium text-gray-700"
                >
                  Latitude <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="addr_lat"
                  name="addr_lat"
                  type="number"
                  value={form.addr_lat}
                  onChange={handleChange}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.addr_lat && (
                  <span className="text-red-600 text-xs">
                    {formErrors.addr_lat}
                  </span>
                )}
              </div>
              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 py-6 text-lg font-medium"
              >
                {isEditMode ? "Update Employer" : "Add Employer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Employer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this employer?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteEmployer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerManagement;
