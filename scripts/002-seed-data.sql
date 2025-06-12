-- Seed data for CorruMap platform
-- Insert sample corruption reports for testing

INSERT INTO reports (title, description, category, location, coordinates, estimated_amount, status, anonymous, verification_score) VALUES
('Municipal Contract Fraud', 'City officials awarded construction contracts to shell companies owned by relatives, inflating costs by 300%. Multiple witnesses and financial records available.', 'fraud', 'São Paulo, Brazil', POINT(-46.6333, -23.5505), 2300000.00, 'verified', true, 95),

('Police Bribery Network', 'Systematic bribery scheme involving traffic police demanding payments to avoid citations. Multiple video recordings and witness testimonies collected.', 'bribery', 'Lagos, Nigeria', POINT(3.3792, 6.5244), 450000.00, 'investigating', true, 78),

('Healthcare Embezzlement', 'Hospital administrator diverted medical supplies and equipment worth millions to private clinics. Financial audit reveals discrepancies.', 'embezzlement', 'Mumbai, India', POINT(72.8777, 19.0760), 1800000.00, 'verified', true, 92),

('Construction Kickbacks', 'Government officials received kickbacks from construction companies for infrastructure projects. Bank records show suspicious transfers.', 'kickbacks', 'Mexico City, Mexico', POINT(-99.1332, 19.4326), 5200000.00, 'pending', true, 65),

('Judicial Corruption', 'Judge allegedly accepted bribes to influence court decisions in favor of wealthy defendants. Multiple cases under review.', 'bribery', 'Nairobi, Kenya', POINT(36.8219, -1.2921), 750000.00, 'investigating', true, 82),

('Procurement Fraud', 'Government agency purchased overpriced equipment from companies owned by officials family members.', 'fraud', 'Bangkok, Thailand', POINT(100.5018, 13.7563), 980000.00, 'verified', true, 88);

-- Insert sample evidence records
INSERT INTO evidence (report_id, file_name, file_type, file_size, encrypted_path, hash) VALUES
(1, 'contract_documents.pdf', 'application/pdf', 2048576, '/encrypted/evidence/001/contract_docs_encrypted.bin', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'),
(1, 'financial_records.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1024000, '/encrypted/evidence/001/financial_encrypted.bin', 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7'),
(2, 'bribery_video.mp4', 'video/mp4', 15728640, '/encrypted/evidence/002/video_encrypted.bin', 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8'),
(3, 'audit_report.pdf', 'application/pdf', 3145728, '/encrypted/evidence/003/audit_encrypted.bin', 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9');

-- Insert verification records
INSERT INTO verifications (report_id, verifier_id, verification_type, status, notes) VALUES
(1, 'verifier_001', 'document_analysis', 'completed', 'All financial documents verified against public records. Discrepancies confirmed.'),
(1, 'verifier_002', 'witness_interview', 'completed', 'Three independent witnesses corroborate the allegations.'),
(2, 'verifier_003', 'video_analysis', 'in_progress', 'Video authenticity being verified through forensic analysis.'),
(3, 'verifier_001', 'financial_audit', 'completed', 'Independent audit confirms missing medical supplies worth $1.8M.');

-- Insert blockchain records for immutable audit trail
INSERT INTO blockchain_records (record_type, record_id, block_hash, previous_hash, data_hash) VALUES
('report', 1, '000abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef', '000000000000000000000000000000000000000000000000000000000000000', 'hash_of_report_1_data'),
('report', 2, '000def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc', '000abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef', 'hash_of_report_2_data'),
('report', 3, '000ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc456def', '000def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc', 'hash_of_report_3_data'),
('verification', 1, '000jkl012mno345pqr678stu901vwx234yz567890abcdef123abc456def789ghi', '000ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc456def', 'hash_of_verification_1_data');

-- Initialize dead man's switch for sample admin
INSERT INTO dead_mans_switch (admin_id, checkin_interval, emergency_contacts, is_active) VALUES
('admin_001', 24, ARRAY['emergency@corrumap.org', 'backup@corrumap.org'], true);
