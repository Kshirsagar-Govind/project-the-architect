import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { Edit, CreditCard, Calendar } from "lucide-react";

interface Subscription {
  _id: string;
  clientId: string;
  plan: "basic" | "standard" | "advanced";
  paymentStatus: "in-progress" | "cancelled" | "paid";
  boughtOn: string;
  createdAt: string;
}

export default function ViewSubscription() {
  const { clientId } = useParams<{ clientId: string }>();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      fetchSubscription();
    }
  }, [clientId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/plan/subscription/${clientId}`);
      setSubscription(res.data.data || null);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch subscription.");
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "standard":
        return "bg-green-100 text-green-700 border-green-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center">
            <p className="text-red-600 mb-4">{error || "No subscription found."}</p>
            <Link
              to={`/dashboard/clients/${clientId}/subscription/add`}
              className="inline-block btn-primary"
            >
              Add Subscription
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Subscription Details</h1>
          <Link
            to={`/dashboard/clients/${clientId}/subscription/${subscription._id}/edit`}
            className="flex items-center gap-2 btn-primary"
          >
            <Edit className="w-5 h-5" />
            Update Subscription
          </Link>
        </div>

        <div className="card p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border mt-1 inline-block ${getPlanColor(subscription.plan)}`}>
                    {subscription.plan.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border mt-1 inline-block ${getPaymentStatusColor(subscription.paymentStatus)}`}>
                    {subscription.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Purchased On</p>
                  <p className="text-gray-800 font-medium">{new Date(subscription.boughtOn).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-gray-800 font-medium">{new Date(subscription.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link
                to={`/dashboard/clients/${clientId}`}
                className="text-teal-600 hover:text-teal-700 hover:underline"
              >
                ← Back to Client
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
