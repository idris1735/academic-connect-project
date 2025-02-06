"use client";
import NavComponent from "../../components/NavComponent";
import { NetworkSidebar } from "@/components/NetworkSidebar";
import { ConnectionInvitations } from "../../components/ConnectionInvitations";
import { ManageConnections } from "@/components/ManageConnections";
import { useState } from "react";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <NavComponent />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <NetworkSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:col-span-9 space-y-8">
            {activeTab === "requests" ? (
              <ConnectionInvitations />
            ) : (
              <ManageConnections />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
