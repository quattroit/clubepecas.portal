"use client";

import { useParams } from "next/navigation";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { NotFound } from "@/components/feedback/NotFound";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ROUTES } from "@/constants/routes";
import {
  AddToQuotationButton,
  AdvertisementDetails,
  AdvertisementGrid,
  ImageGallery,
  SellerContactCard,
  ShareButtons,
} from "@/features/marketplace";
import { AdvertisementDetailSkeleton } from "@/features/marketplace/components/AdvertisementDetailSkeleton";
import { useTrackListingView } from "@/hooks/analytics/useTrackPageViews";
import { useAdvertisement } from "@/hooks/api/useAdvertisement";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { NotFoundError } from "@/lib/errors";

/**
 * Detalhe público /anuncios/[slug] — mesma UI, dados da API.
 */
function AdvertisementDetailPageView() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const detailQuery = useAdvertisement(slug ?? "");
  useTrackListingView(
    detailQuery.isSuccess && detailQuery.data ? slug : null,
  );

  if (detailQuery.isLoading) {
    return <AdvertisementDetailSkeleton />;
  }

  if (detailQuery.isError) {
    if (detailQuery.error instanceof NotFoundError) {
      return (
        <NotFound
          title="Anúncio não encontrado"
          description="Este anúncio não existe ou não está mais disponível."
          homeHref={ROUTES.ADVERTISEMENTS}
        />
      );
    }

    return (
      <ErrorMessage
        title="Não foi possível carregar o anúncio"
        message={getFriendlyErrorMessage(detailQuery.error)}
      />
    );
  }

  if (!detailQuery.data) {
    return (
      <NotFound
        title="Anúncio não encontrado"
        description="Este anúncio não existe ou não está mais disponível."
        homeHref={ROUTES.ADVERTISEMENTS}
      />
    );
  }

  const { advertisement, seller, related, images, thumbnails } =
    detailQuery.data;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Anúncios", href: ROUTES.ADVERTISEMENTS },
          { label: advertisement.title },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <ImageGallery
          images={images}
          thumbnails={thumbnails}
          alt={advertisement.title}
        />

        <div className="flex flex-col gap-6">
          <AdvertisementDetails advertisement={advertisement} />
          <SellerContactCard
            seller={seller}
            advertisementTitle={advertisement.title}
            listingSlug={advertisement.slug ?? slug}
          />
          {seller.id > 0 ? (
            <AddToQuotationButton
              advertisementId={advertisement.id}
              sellerId={seller.id}
              storeName={seller.name}
              sellerWhatsApp={seller.whatsApp}
              title={advertisement.title}
              thumbnailUrl={advertisement.imageUrl ?? null}
              slug={advertisement.slug ?? slug ?? ""}
            />
          ) : null}
          <ShareButtons />
        </div>
      </div>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="related-heading" className="text-h2">
            Você também pode gostar
          </h2>
          <AdvertisementGrid advertisements={related} />
        </section>
      ) : null}
    </div>
  );
}

export { AdvertisementDetailPageView };
