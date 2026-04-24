import { createTriggerFromConfig, createTagFromConfig } from "./googleTagManager.services.js"
import {
  addToCartGenerateTriggerConfig,
  beginCheckoutGenerateTriggerConfig
} from "../../utils/template/ecommerceTemplateTrigger.js"
import {
  ga4EventTagTemplate,
  googleAdsTagTemplate
} from "../../utils/template/ecommerceTemplateTag.js"

export const ecommerceBaseTags = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {
  const { addToCart, beginCheckout } = config;

  const addToCartTrigger = await createTriggerFromConfig(
    auth, accountId, containerId, workspaceId,
    addToCartGenerateTriggerConfig(addToCart)
  );

  const beginCheckoutTrigger = await createTriggerFromConfig(
    auth, accountId, containerId, workspaceId,
    beginCheckoutGenerateTriggerConfig(beginCheckout)
  );

  const addToCartGA4Tag = await createTagFromConfig(
    auth, accountId, containerId, workspaceId,
    ga4EventTagTemplate({
      tagName: "Add to Cart - GA4",
      eventName: "add_to_cart",
      measurementId: addToCart.measurementId,
      triggerId: addToCartTrigger.triggerId
    })
  );

  const addToCartAdsTag = await createTagFromConfig(
    auth, accountId, containerId, workspaceId,
    googleAdsTagTemplate({
      tagName: "Add to Cart - Google Ads",
      eventName: "add_to_cart",
      conversionId: addToCart.conversionId,
      conversionLabel: addToCart.conversionLabel,
      triggerId: addToCartTrigger.triggerId
    })
  );

  const beginCheckoutGA4Tag = await createTagFromConfig(
    auth, accountId, containerId, workspaceId,
    ga4EventTagTemplate({
      tagName: "Begin Checkout - GA4",
      eventName: "begin_checkout",
      measurementId: beginCheckout.measurementId,
      triggerId: beginCheckoutTrigger.triggerId
    })
  );

  const beginCheckoutAdsTag = await createTagFromConfig(
    auth, accountId, containerId, workspaceId,
    googleAdsTagTemplate({
      tagName: "Begin Checkout - Google Ads",
      eventName: "begin_checkout",
      conversionId: beginCheckout.conversionId,
      conversionLabel: beginCheckout.conversionLabel,
      triggerId: beginCheckoutTrigger.triggerId
    })
  );

  return {
    success: true,
    triggers: { addToCartTrigger, beginCheckoutTrigger },
    tags: { addToCartGA4Tag, addToCartAdsTag, beginCheckoutGA4Tag, beginCheckoutAdsTag }
  };
};