import Image from 'next/image';
import Link from 'next/link';

export default function PostPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <Image
            src="/placeholder.png"
            width={1080}
            height={800}
            alt="Nova Benefits and ICICI Lombard partnership illustration showing handshake with company logos"
            className="w-full h-auto rounded-2xl"
          />
        </div>
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-[1.1]">
            How Nova Benefits and ICICI Lombard Transformed Claims Processing
            with Real-Time Digital Innovation
          </h1>
          <div className="mt-6 flex flex-col gap-1">
            <span className="text-foreground/80 font-medium">
              By Sakshi Maheshwari{' '}
              <span className="text-foreground/70">in</span>{' '}
              <Link href="" className="underline">
                Interviews
              </Link>
            </span>
            <time className="text-foreground/60">May 28, 2025</time>
          </div>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-[260px_minmax(0,1fr)] gap-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Table of contents</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-foreground/70 hover:text-foreground"
              >
                Inroduction
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-foreground/70 hover:text-foreground"
              >
                What is software?
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-foreground/70 hover:text-foreground"
              >
                Why people fail?
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-xl leading-normal">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores fuga
          eligendi, voluptatibus beatae totam minima? Sint distinctio, eos
          aperiam hic iste in dignissimos soluta quis assumenda voluptas at
          vitae earum? In commodi molestiae eius aut asperiores blanditiis odio
          impedit vitae voluptatibus eligendi autem repudiandae ex aperiam
          repellendus omnis optio voluptatem quasi incidunt ipsa fugit, ducimus
          consequuntur. Ad praesentium in possimus. Id eos culpa, eius earum
          tempore beatae hic ab similique provident qui ipsam accusamus
          voluptate harum, doloribus veniam iure corrupti deserunt impedit quod
          esse. Reiciendis maiores praesentium molestiae sapiente suscipit?
          Adipisci sapiente consequatur dolore cum minima repellendus. Ipsa et
          vero inventore quasi exercitationem laudantium vel animi, libero
          blanditiis, alias officiis quia incidunt eligendi delectus tenetur nam
          nemo dolorum? Consequatur, quidem! Tempora enim vero delectus commodi
          amet perferendis, nulla temporibus, quasi culpa placeat laudantium
          illum earum provident praesentium beatae exercitationem similique
          doloribus ipsam non vitae nisi dicta inventore autem. Expedita,
          minima! Eligendi quo consectetur veniam modi facere, quos odio vel
          recusandae necessitatibus labore alias tempora in. Quos accusantium
          rerum repudiandae reprehenderit explicabo corporis, rem, ad natus sit
          a, nobis optio incidunt. Odit, alias beatae repellendus blanditiis
          recusandae neque rerum nesciunt harum molestiae expedita. Impedit
          ratione, id necessitatibus totam vitae iste voluptas cumque velit
          placeat perferendis itaque at beatae similique numquam ducimus!
          Impedit, accusamus id perferendis esse assumenda obcaecati corrupti
          dicta voluptate, qui odio commodi dolorum maxime amet dolor iste est
          quaerat error eius soluta sequi? Voluptatibus a temporibus repudiandae
          tempore perferendis. Explicabo, quo, earum tempora sunt totam eum
          optio asperiores animi ut reiciendis velit illo mollitia odit dolorum
          cumque reprehenderit assumenda hic? Est, fugit. Laborum aliquam
          laboriosam ut sint qui odit? Consequuntur, a id? Consequuntur quidem
          velit quisquam, sapiente obcaecati expedita, in maiores et
          exercitationem voluptatibus id numquam voluptatum delectus? Earum
          ipsam officia voluptatem quos omnis fugit nihil fuga cumque deserunt.
        </div>
      </div>
    </div>
  );
}
