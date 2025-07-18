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

// Replace with your actual Supervisor API/service
import { useSupervisorService } from "../api/crudSupervisor";

const SupervisorManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Supervisor data
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [editSupervisorId, setEditSupervisorId] = useState<number | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSupervisorId, setDeleteSupervisorId] = useState<number | null>(
    null
  );

  // Form validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Supervisor CRUD API
  const {
    getAllSupervisors,
    createSupervisor,
    updateSupervisor,
    deleteSupervisor,
    getSupervisorById,
  } = useSupervisorService();

  useEffect(() => {
    setLoading(true);
    getAllSupervisors()
      .then((data) => setSupervisors(Array.isArray(data) ? data : []))
      .catch(() => setSupervisors([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddSupervisor = () => {
    setIsEditMode(false);
    setEditSupervisorId(null);
    resetForm();
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleSubmitSupervisor = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email_address: emailAddress,
      contact_number: contactNumber,
    };
    try {
      if (isEditMode && editSupervisorId) {
        await updateSupervisor(editSupervisorId, payload);
      } else {
        await createSupervisor(payload);
      }
      const data = await getAllSupervisors();
      setSupervisors(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Failed to save supervisor. See console for details.");
      console.error(err);
    }
    setIsFormSubmitted(false);
    setIsAddDialogOpen(false);
    setIsEditMode(false);
    setEditSupervisorId(null);
    resetForm();
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmailAddress("");
    setContactNumber("");
    setIsFormSubmitted(false);
  };

  // Filter and sort supervisors by search query and SupervisorID
  const filteredSortedSupervisors = [...supervisors]
    .filter((item) => {
      const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
      const idStr = String(item.supervisor_id);
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        idStr.includes(searchQuery.trim())
      );
    })
    .sort((a, b) => a.supervisor_id - b.supervisor_id);

  // Open edit dialog and populate form
  const handleEditSupervisor = async (supervisor) => {
    try {
      const fullSupervisorData = await getSupervisorById(
        supervisor.supervisor_id
      );
      setEditSupervisorId(supervisor.supervisor_id);
      setIsEditMode(true);
      setFormErrors({});
      setFirstName(fullSupervisorData.first_name || "");
      setLastName(fullSupervisorData.last_name || "");
      setEmailAddress(fullSupervisorData.email_address || "");
      setContactNumber(fullSupervisorData.contact_number || "");
      setIsAddDialogOpen(true);
    } catch (error) {
      alert("Failed to load supervisor data for editing.");
      console.error(error);
    }
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditMode(false);
    setEditSupervisorId(null);
    resetForm();
  };

  // Open delete dialog
  const handleDeleteSupervisor = (id: number) => {
    setDeleteSupervisorId(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDeleteSupervisor = async () => {
    if (typeof deleteSupervisorId !== "number" || isNaN(deleteSupervisorId)) {
      return;
    }
    try {
      await deleteSupervisor(deleteSupervisorId);
      const data = await getAllSupervisors();
      setSupervisors(Array.isArray(data) ? data : []);
      setIsDeleteDialogOpen(false);
      setDeleteSupervisorId(null);
    } catch (err) {
      alert("Failed to delete supervisor. See console for details.");
      console.error(err);
    }
  };

  // Validate form inputs
  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!emailAddress.trim()) {
      errors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      errors.emailAddress = "Invalid email address";
    }
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (
      !/^07\d{8}$/.test(contactNumber.trim()) &&
      !/^\+\d{10,15}$/.test(contactNumber.trim())
    ) {
      errors.contactNumber =
        "Must be a valid local (07XXXXXXXX) or international (+XXXXXXXXXXX) number";
    }
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
                  Supervisor Management
                </h2>
              </div>
              <Button
                onClick={handleAddSupervisor}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Supervisor
              </Button>
            </div>

            {/* Search and Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    className="pl-10 bg-white/80 backdrop-blur-sm shadow-sm border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Search supervisors by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-md">
                <p className="text-sm font-medium opacity-90">
                  Total Supervisors
                </p>
                <p className="text-2xl font-bold mt-1">{supervisors.length}</p>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableHead className="w-16 font-semibold text-gray-700">
                      ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      NAME
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      EMAIL
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      CONTACT
                    </TableHead>
                    <TableHead className="w-24 font-semibold text-gray-700">
                      ACTION
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredSortedSupervisors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No supervisors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSortedSupervisors.map((item) => (
                      <TableRow
                        key={item.supervisor_id}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {item.supervisor_id}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {item.first_name} {item.last_name}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {item.email_address}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {item.contact_number}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSupervisor(item)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit supervisor"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete supervisor"
                              onClick={() =>
                                handleDeleteSupervisor(item.supervisor_id)
                              }
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

      {/* Add/Edit Supervisor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isEditMode ? "Edit Supervisor" : "Add New Supervisor"}
            </DialogTitle>
            <p className="text-gray-500 text-sm mt-1">
              {isEditMode
                ? "Update the supervisor details below"
                : "Fill in the details to add a new supervisor"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmitSupervisor} className="mt-6">
            <div className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Firstname <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1.5 bg-white/80"
                  />
                  {isFormSubmitted && formErrors.firstName && (
                    <span className="text-red-600 text-xs">
                      {formErrors.firstName}
                    </span>
                  )}
                </div>
                <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Lastname <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1.5 bg-white/80"
                  />
                  {isFormSubmitted && formErrors.lastName && (
                    <span className="text-red-600 text-xs">
                      {formErrors.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="emailAddress"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.emailAddress && (
                  <span className="text-red-600 text-xs">
                    {formErrors.emailAddress}
                  </span>
                )}
              </div>

              {/* Contact Number */}
              <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                <Label
                  htmlFor="contactNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Number <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="mt-1.5 bg-white/80"
                />
                {isFormSubmitted && formErrors.contactNumber && (
                  <span className="text-red-600 text-xs">
                    {formErrors.contactNumber}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 py-6 text-lg font-medium"
              >
                {isEditMode ? "Update Supervisor" : "Add Supervisor"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Supervisor</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this supervisor?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteSupervisor}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorManagement;
