import { useState, useEffect } from 'react';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProfile, updateProfile } from '@/api/farmerApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStore,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faSave,
  faCircleNotch,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FarmerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    stall_name: '',
    operating_days: [],
    pickup_windows: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.data?.success && res.data?.profile) {
        const p = res.data.profile;
        setFormData({
          stall_name: p.stall_name || '',
          operating_days: p.operating_days || [],
          pickup_windows: p.pickup_windows || '',
          latitude: p.latitude !== undefined && p.latitude !== null ? p.latitude : '',
          longitude: p.longitude !== undefined && p.longitude !== null ? p.longitude : '',
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to load stall profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.operating_days.includes(day);
      const updatedDays = exists
        ? prev.operating_days.filter((d) => d !== day)
        : [...prev.operating_days, day];
      return { ...prev, operating_days: updatedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        stall_name: formData.stall_name.trim(),
        operating_days: formData.operating_days,
        pickup_windows: formData.pickup_windows.trim(),
        latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
      };

      const res = await updateProfile(payload);
      if (res.data?.success) {
        setFeedback({ type: 'success', message: 'Stall profile updated successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Stall Profile Management</h1>
            <p className="text-xs sm:text-sm text-earth-700">Update your public farm identity, market operating days, and pickup windows.</p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <FontAwesomeIcon icon={feedback.type === 'success' ? faCheckCircle : faStore} />
            <span>{feedback.message}</span>
          </div>
        )}

        {loading ? (
          <Card className="p-12 text-center text-earth-500">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-primary mb-2" />
            <p className="text-sm font-medium">Loading stall profile details...</p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-warm-surface border-earth-200/80">
              <CardHeader>
                <CardTitle className="text-lg">Farm & Stall Identity</CardTitle>
                <CardDescription className="text-xs">
                  This name represents your stall across local farmers markets and product listings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="stall_name" className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1.5">
                    Stall / Farm Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500">
                      <FontAwesomeIcon icon={faStore} />
                    </div>
                    <input
                      id="stall_name"
                      type="text"
                      required
                      value={formData.stall_name}
                      onChange={(e) => setFormData({ ...formData, stall_name: e.target.value })}
                      placeholder="Green Valley Organic Farm"
                      className="w-full h-11 pl-10 pr-4 bg-warm-surface border border-earth-300/80 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-warm-surface border-earth-200/80">
              <CardHeader>
                <CardTitle className="text-lg">Operating Schedule & Pickup Windows</CardTitle>
                <CardDescription className="text-xs">
                  Select the days your stall is active and specify cutoff / pickup availability times.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-2">
                    Operating Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = formData.operating_days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-forest-900 text-accent-lime border-forest-900 shadow-sm'
                              : 'bg-warm-cream text-earth-700 border-earth-200 hover:bg-earth-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1.5 opacity-70" />
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="pickup_windows" className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1.5">
                    Pickup Windows / Cutoff Policy
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <input
                      id="pickup_windows"
                      type="text"
                      value={formData.pickup_windows}
                      onChange={(e) => setFormData({ ...formData, pickup_windows: e.target.value })}
                      placeholder="e.g. Saturdays 8:00 AM - 1:00 PM (Cutoff: Fridays 6:00 PM)"
                      className="w-full h-11 pl-10 pr-4 bg-warm-surface border border-earth-300/80 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-warm-surface border-earth-200/80">
              <CardHeader>
                <CardTitle className="text-lg">Location Coordinates</CardTitle>
                <CardDescription className="text-xs">
                  Used to position your farm or market stall pin accurately on community interactive maps.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1.5">
                    Latitude
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="37.7749"
                      className="w-full h-11 pl-10 pr-4 bg-warm-surface border border-earth-300/80 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1.5">
                    Longitude
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="-122.4194"
                      className="w-full h-11 pl-10 pr-4 bg-warm-surface border border-earth-300/80 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving} className="px-6 py-2.5">
                {saving ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-2" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    <span>Save Stall Profile</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </FarmerLayout>
  );
};

export default FarmerProfile;
