import React from "react";

function LegalBlock({ block }) {
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm font-medium leading-relaxed text-gray-600 marker:text-gray-500 md:text-[15px] lg:text-[16px]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "contact") {
    return (
      <div className="space-y-1 pt-1 text-sm font-medium leading-relaxed text-gray-600 md:text-[15px] lg:text-[16px]">
        {block.items.map((item) => (
          <p key={item.label}>
            <span className="font-extrabold text-gray-700">{item.label}</span>
            {item.value && ` ${item.value}`}
          </p>
        ))}
      </div>
    );
  }

  return (
    <p className="text-sm font-medium leading-relaxed text-gray-600 md:text-[15px] lg:text-[16px]">
      {block.text}
    </p>
  );
}

export default function LegalContent({ sections }) {
  return (
    <div className="flex w-full flex-col gap-7 md:gap-8">
      {sections.map((section) => (
        <section key={section.id || section.title} className="space-y-3">
          {section.title && (
            <h2 className="text-lg font-bold leading-snug text-primary md:text-xl">
              {section.title}
            </h2>
          )}
          <div className="space-y-2.5">
            {section.content.map((block, index) => (
              <LegalBlock key={`${section.id || section.title}-${index}`} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
