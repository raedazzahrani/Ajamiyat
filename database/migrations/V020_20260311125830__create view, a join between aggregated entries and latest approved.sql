CREATE OR REPLACE VIEW aggregated_latest_approved AS(
	SELECT ea.*, la.latest as latest_approved FROM 
	entries_aggregated ea LEFT JOIN latest_approved la 
	ON ea.entry_id = la.entry_id
);