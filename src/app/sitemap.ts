import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/swap`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/limit`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/pool/create`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/pool/pools`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/tokenv1/create`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/tokenv2/create`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/tokenv2/withdraw`
        },
    ]
}