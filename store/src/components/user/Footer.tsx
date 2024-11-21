import Google from "../../assets/Google.png";
import Phone from "../../assets/Phone.png";
import Group from "../../assets/Group.png";

function Footer() {
  return (
    <footer
      className="flex flex-col items-center justify-between md:flex-row space-y-10 bg-cover bg-center px-6 lg:px-40"
      style={{ backgroundImage: `url(${Group})` }}
    >
      <div className="space-y-6">
        <h2>Order Food</h2>
        <p>
          Make ordering your food easier <br /> with our mobile app. You can get
          it on the google play store
        </p>

        <div>
          <img src={Google} alt="" />
        </div>
      </div>

      <div className="">
        <img src={Phone} alt="" className="h-[250px]" />
      </div>
    </footer>
  );
}

export default Footer;
