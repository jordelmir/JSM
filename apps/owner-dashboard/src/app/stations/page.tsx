'use client';

import React, { useState, useEffect } from 'react'; // Add useEffect
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify'; // Import toast
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  Station, // Import Station interface
  CreateStationDto, // Import CreateStationDto
  UpdateStationDto, // Import UpdateStationDto
} from '@/lib/stationApiClient'; // Import API client

// Remove mockStations

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]); // Initialize with empty array
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [newStation, setNewStation] = useState<CreateStationDto>({ // Use CreateStationDto
    name: '',
    latitude: 0, // Initialize with number
    longitude: 0, // Initialize with number
  });
  const [errors, setErrors] = useState<Partial<CreateStationDto>>({}); // Use CreateStationDto
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const data = await getStations();
        setStations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stations.');
        toast.error(err.message || 'Failed to fetch stations.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, []); // Fetch on mount

  const validateForm = (form: CreateStationDto): boolean => { // Use CreateStationDto
    const newErrors: Partial<CreateStationDto> = {}; // Use CreateStationDto

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    // Removed address validation as it's not in the DTO
    if (isNaN(form.latitude)) { // Check if it's a number
      newErrors.latitude = 'Latitud válida requerida';
    }
    if (isNaN(form.longitude)) { // Check if it's a number
      newErrors.longitude = 'Longitud válida requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStation = async () => {
    if (!validateForm(newStation)) return;

    setIsSubmitting(true);
    try {
      const created = await createStation({
        name: newStation.name,
        latitude: newStation.latitude,
        longitude: newStation.longitude,
        // status will default in backend
      });
      setStations((prev) => [...prev, created]);
      setNewStation({ name: '', latitude: 0, longitude: 0 }); // Reset form
      setErrors({});
      setShowAddModal(false);
      toast.success('¡Estación creada exitosamente!');
    } catch (err: any) {
      console.error('Error creating station:', err);
      toast.error(err.message || 'Error al crear estación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
  };

  const handleUpdateStation = async () => {
    if (!editingStation) return;

    setIsSubmitting(true);
    try {
      const updated = await updateStation(editingStation.id, {
        name: editingStation.name,
        latitude: editingStation.latitude,
        longitude: editingStation.longitude,
        status: editingStation.status,
      });
      setStations((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      setEditingStation(null);
      toast.success('¡Estación actualizada exitosamente!');
    } catch (err: any) {
      console.error('Error updating station:', err);
      toast.error(err.message || 'Error al actualizar estación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta estación? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      await deleteStation(id);
      setStations((prev) => prev.filter((s) => s.id !== id));
      toast.success('Estación eliminada exitosamente');
    } catch (err: any) {
      console.error('Error deleting station:', err);
      toast.error(err.message || 'Error al eliminar estación.');
    }
  };

  const toggleStationStatus = async (id: string) => {
    try {
      const stationToUpdate = stations.find((s) => s.id === id);
      if (!stationToUpdate) return;

      const updated = await updateStation(id, { status: stationToUpdate.status === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA' }); // Toggle status
      setStations((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      toast.success('Estado de la estación actualizado.');
    } catch (err: any) {
      console.error('Error toggling station status:', err);
      toast.error(err.message || 'Error al actualizar el estado de la estación.');
    }
  };

  const resetForm = () => {
    setNewStation({ name: '', latitude: 0, longitude: 0 }); // Reset to numbers
    setErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Estaciones
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Administra tus gasolineras y su rendimiento
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nueva Estación
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Estaciones
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Estaciones Activas
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stations.filter((s) => s.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Empleados
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stations.reduce((sum, s) => sum + s.employeeCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tickets Hoy</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stations.reduce((sum, s) => sum + s.todayTickets, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stations Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Estaciones ({stations.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estación
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleados
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Hoy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos Hoy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversión
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr
                    key={station.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {station.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {station.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                        {station.employeeCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {station.todayTickets}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ₡{station.todayRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          station.conversionRate >= 80
                            ? 'text-green-700 bg-green-100'
                            : station.conversionRate >= 70
                            ? 'text-yellow-700 bg-yellow-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {station.conversionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStationStatus(station.id)}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${station.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditStation(station)}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2"
                          title="Editar estación"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStation(station.id)}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-600 hover:text-red-900 hover:bg-red-50 p-2"
                          title="Eliminar estación"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Station Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Nueva Estación
              </h3>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Estación *
                </label>
                <input
                  type="text"
                  value={newStation.name}
                  onChange={(e) =>
                    setNewStation({ ...newStation, name: e.target.value })
                  }
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'}`}
                />
                {errors.name && (
                  <div className="flex items-center mt-2 text-red-600">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitud *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newStation.latitude}
                    onChange={(e) =>
                      setNewStation({ ...newStation, latitude: parseFloat(e.target.value) }) // Parse to number
                    }
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.latitude ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'}`}
                  />
                  {errors.latitude && (
                    <div className="flex items-center mt-1 text-red-600">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      <span className="text-xs">{errors.latitude}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitud *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newStation.longitude}
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        longitude: e.target.value,
                      })
                    }
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.longitude ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'}`}
                  />
                  {errors.longitude && (
                    <div className="flex items-center mt-1 text-red-600">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      <span className="text-xs">{errors.longitude}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={resetForm}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStation}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Crear Estación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Station Modal */}
      {editingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Editar Estación
              </h3>
              <button
                onClick={() => setEditingStation(null)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2"
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Estación
                </label>
                <input
                  type="text"
                  value={editingStation.name}
                  onChange={(e) =>
                    setEditingStation({
                      ...editingStation,
                      name: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingStation.latitude}
                    onChange={(e) =>
                      setEditingStation({
                        ...editingStation,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingStation.longitude}
                    onChange={(e) =>
                      setEditingStation({
                        ...editingStation,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setEditingStation(null)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateStation}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Actualizar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
