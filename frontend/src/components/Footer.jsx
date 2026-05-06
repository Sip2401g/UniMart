const Footer = () => {
  return (
    <footer className="site-footer">
      <p>Copyright © {new Date().getFullYear()} Uni Mart. All rights reserved.</p>
      <div className="footer-links">
        <a href="mailto:campusbazaar.support@gmail.com">Email</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
