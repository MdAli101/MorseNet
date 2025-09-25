import { Routes, Route } from 'react-router-dom';
import CitizenHome from './CitizenHome';
import ReportIssue from './ReportIssue';
import MyReports from './MyReports';
import MapView from './MapView';

const CitizenApp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route index element={<CitizenHome />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="my-reports" element={<MyReports />} />
        <Route path="map" element={<MapView />} />
      </Routes>
    </div>
  );
};

export default CitizenApp;