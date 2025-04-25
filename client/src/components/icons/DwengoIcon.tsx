function DwengoIcon({ href }: { href: string }) {
  return (
    <a href={href} style={{ height: '100%' }}>
      <img
        src="/dwengo-groen-zwart.svg" // Path to the icon in the public folder
        alt="Dwengo Icon"
        style={{ height: '100%' }} // 75% of the parent container's height
      />
    </a>
  );
}

export default DwengoIcon;
