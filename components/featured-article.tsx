"use client"

import Image from "next/image"
import { ArrowRight, Clock } from "lucide-react"

export function FeaturedArticle() {
  return (
    <section className="section-spacing pattern-bg" id="featured">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-12">
          <h2 className="section-title">Article à la une</h2>
          <button className="btn-outline">
            Tous les articles <ArrowRight size={16} className="ml-2" />
          </button>
        </div>

        <div className="featured-article">
          <div className="md:w-1/2 relative aspect-video md:aspect-auto">
            <Image src="/professional-headshot.png" alt="Dr. Dinesh K. Chhetri" fill className="object-cover" />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex items-center mb-4">
              <span className="publication-tag mr-3">Laryngologie & Recherche</span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>15 avril 2023</span>
              </div>
            </div>

            <h3 className="font-playfair font-bold text-2xl mb-4">
              "Le problème des troubles de la voix ne peut pas être résorbé par les traitements traditionnels dans leur
              état actuel"
            </h3>

            <p className="text-gray-600 mb-6">
              Analyse des défis cliniques actuels et des solutions innovantes pour le traitement des troubles de la voix
              et de la déglutition.
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Clock size={14} className="mr-1" />
              <span>8 min de lecture</span>
            </div>

            <button className="btn-primary">
              Lire l'article <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
