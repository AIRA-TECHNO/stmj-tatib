'use client'
import Link from "next/link";
import { useEffect } from "react";


export default function Page() {
  useEffect(() => {
    window.location.href = '/tatib/panel'
  }, [])

  return 'Loading...'
  return (
    <div>
      <div className="flex">
        <div>LOGO.</div>
        <div className="flex">
          <Link href={"/"}>home</Link>
          <Link href={"/"}>loker</Link>
          <Link href={"/"}>berita</Link>
          <Link href={"/"}>forum</Link>
          <Link href={"/"}>profile</Link>
        </div>
      </div>
      <div id="hero">
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit eligendi animi sequi cumque ipsa.</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit eligendi animi sequi cumque ipsa.</div>
      </div>
      <div id="sambutan">
        <div className="flex items-center">
          <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim nisi ex impedit quo nulla non aperiam recusandae earum debitis beatae optio atque temporibus, perspiciatis deserunt. Debitis aliquid itaque nihil necessitatibus?</div>
          <div className="bg-profile h-[17rem]"></div>
        </div>
      </div>
      <div id="mitra">
        <div>kami telah menjalin kerja sama dengan berbagai pihak untuk pemberdayaan dan peningkatan kualitas alumni</div>
        <div>
          {[...Array(5).keys()].map((_, index) => (
            <div key={index} className="bg-profile h-[8rem] inline-block mx-4"></div>
          ))}
        </div>
      </div>
      <div id="loker">
        <div>informasi pekerjaan terkini</div>
        {[...Array(5).keys()].map((_, index) => (
          <div key={index}>
            <div>Frontend developer</div>
            <div>PT. Trisakti Tunggal Buana</div>
            <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
          </div>
        ))}
      </div>
      <div id="chart">
        <div>pandangan singkat keberhasilan tracer study</div>
        <div></div>
      </div>
      <div id="news">
        <div>Berita Terkini</div>
        <div>
          {[...Array(5).keys()].map((_, index) => (
            <div key={index}>
              <div>SRMJ meraih juara 2 LKS Jatim</div>
            </div>
          ))}
        </div>
      </div>
      <div id="footer">
        <div className="flex">
          <div>{`Copyright 2022 BKK SMK N 1 Jenangan Ponorogo`}</div>
          <div className="ml-auto flex">
            <div>Whatsapp</div>
            <div>Facebook</div>
            <div>Instagram</div>
            <div>Telegram</div>
          </div>
        </div>
      </div>
    </div>
  );
}
