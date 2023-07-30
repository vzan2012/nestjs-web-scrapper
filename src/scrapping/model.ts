/**
 * InnerPage Interface
 *
 * @export
 * @interface InnerPage
 * @typedef {InnerPage}
 */
export interface InnerPage {
  pageTitle: string;
  pageMetaDescription: string;
  pageBodyContents?: string;
}

/**
 * Link Interface
 *
 * @export
 * @interface Link
 * @typedef {Link}
 */
export interface Link {
  uuid: string;
  target: string;
  href: string;
  innerText: string;
  contents?: InnerPage;
}
