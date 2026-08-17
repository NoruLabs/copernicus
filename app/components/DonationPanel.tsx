const DONATION_URL =
  "https://buy.polar.sh/polar_cl_lRqpAUUgZ7MQaNPxCzu6bdqjbGyRbPCPy830s1tCXVl";

export function DonationPanel() {
  return (
    <aside className="donation-panel" aria-label="Support Copernicus">
      <div className="donation-panel-inner">
        <a href={DONATION_URL} rel="noopener noreferrer" target="_blank">
          <span>Support Copernicus</span>
          <span>Donate</span>
        </a>
      </div>
    </aside>
  );
}
