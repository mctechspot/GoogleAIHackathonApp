import Image from "next/image";
import BannerGif from "@/public/assets/banner-gif.gif";
import Link from "next/link";
import Footer from "@/app/components/Navigation/Footer";

export default function Home() {
  return (
    <>
      <div className={`h-screen flex flex-col justify-between`}>

        <div className={"h-full w-full flex justify-center items-center"}>
          <div>
            <Link href={"/"}>
              <Image
                src={BannerGif}
                alt={"Home Banner"}
                height={"106"}
                width={"250"}
                className={"block m-auto mb-2 h-auto w-full"}
              />
            </Link>

            {/*<p className={`text-center my-[50px]`}>
              intelligent literary content generator
            </p>*/}

            <Link href={"/generate"}
              className={"block bg-green-standard px-10 py-5 w-fit m-auto text-center rounded-lg"}>
              Try
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div>
          <Footer />
        </div>

      </div>
    </>
  );
}
