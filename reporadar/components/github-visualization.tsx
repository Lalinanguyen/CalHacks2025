'use client'

import { useEffect, useRef, useState } from 'react'
import { GitHubAnalysisResult } from '@/lib/services/github-analysis.service'

interface VisualizationProps {
  data: GitHubAnalysisResult
  type: 'radar' | 'languages' | 'quality-trends' | 'skills-sunburst'
}

interface TooltipData {
  x: number
  y: number
  content: string
  visible: boolean
}

export function GitHubVisualization({ data, type }: VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, content: '', visible: false })

  useEffect(() => {
    if (!containerRef.current || !data) return

    try {
      // Clear previous content
      containerRef.current.innerHTML = ''

      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 400
      canvas.style.cursor = 'pointer'
      canvasRef.current = canvas
      containerRef.current.appendChild(canvas)

      // Create tooltip
      const tooltipDiv = document.createElement('div')
      tooltipDiv.className = 'absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 opacity-0 transition-opacity duration-200'
      tooltipDiv.style.display = 'none'
      containerRef.current.appendChild(tooltipDiv)

      switch (type) {
        case 'radar':
          createInteractiveRadarChart(canvas, tooltipDiv, data)
          break
        case 'languages':
          createInteractiveLanguageChart(canvas, tooltipDiv, data)
          break
        case 'quality-trends':
          createInteractiveQualityTrendsChart(canvas, tooltipDiv, data)
          break
        case 'skills-sunburst':
          createInteractiveSkillsSunburstChart(canvas, tooltipDiv, data)
          break
        default:
          console.warn(`Unknown visualization type: ${type}`)
      }
    } catch (error) {
      console.error('Error creating visualization:', error)
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="text-red-500 p-4">Error loading visualization</div>'
      }
    }
  }, [data, type])

  if (!data) {
    return (
      <div className="relative w-full h-96 bg-white rounded-lg border p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading visualization...</div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-96 bg-white rounded-lg border p-4"
      style={{ minHeight: '400px' }}
    />
  )
}

function createInteractiveRadarChart(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement, data: GitHubAnalysisResult) {
  const ctx = canvas.getContext('2d')!
  if (!ctx) return
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 150

  const axes = ['Code Quality', 'Security', 'Innovation', 'Consistency', 'Language Proficiency']
  const values = [
    data.summary?.avg_code_quality || 0,
    data.summary?.avg_security_score || 0,
    data.summary?.avg_innovation_score || 0,
    data.summary?.avg_consistency_score || 0,
    data.summary?.avg_language_proficiency || 0,
  ]

  const averageValues = [75, 70, 60, 65, 70] // Mock average values

  let hoveredIndex = -1

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw concentric circles
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axes
    axes.forEach((axis, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      // Draw axis labels
      ctx.fillStyle = '#374151'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(axis, x + Math.cos(angle) * 20, y + Math.sin(angle) * 20)
    })

    // Draw average polygon
    ctx.fillStyle = 'rgba(156, 163, 175, 0.2)'
    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 2
    ctx.beginPath()
    averageValues.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
      const normalizedValue = value / 100
      const x = centerX + radius * normalizedValue * Math.cos(angle)
      const y = centerY + radius * normalizedValue * Math.sin(angle)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw user polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    values.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
      const normalizedValue = value / 100
      const x = centerX + radius * normalizedValue * Math.cos(angle)
      const y = centerY + radius * normalizedValue * Math.sin(angle)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw data points with hover effect
    values.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
      const normalizedValue = value / 100
      const x = centerX + radius * normalizedValue * Math.cos(angle)
      const y = centerY + radius * normalizedValue * Math.sin(angle)
      
      ctx.fillStyle = hoveredIndex === i ? '#1d4ed8' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(x, y, hoveredIndex === i ? 6 : 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Add glow effect for hovered point
      if (hoveredIndex === i) {
        ctx.shadowColor = '#3b82f6'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })
  }

  function showTooltip(x: number, y: number, content: string) {
    tooltipDiv.textContent = content
    tooltipDiv.style.left = `${x + 10}px`
    tooltipDiv.style.top = `${y - 10}px`
    tooltipDiv.style.display = 'block'
    tooltipDiv.style.opacity = '1'
  }

  function hideTooltip() {
    tooltipDiv.style.opacity = '0'
    setTimeout(() => {
      tooltipDiv.style.display = 'none'
    }, 200)
  }

  function getMousePos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  function isPointInCircle(mouseX: number, mouseY: number, centerX: number, centerY: number, radius: number) {
    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2)
    return distance <= radius
  }

  canvas.addEventListener('mousemove', (e) => {
    const mousePos = getMousePos(e)
    let foundHover = false

    values.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
      const normalizedValue = value / 100
      const x = centerX + radius * normalizedValue * Math.cos(angle)
      const y = centerY + radius * normalizedValue * Math.sin(angle)
      
      if (isPointInCircle(mousePos.x, mousePos.y, x, y, 8)) {
        hoveredIndex = i
        showTooltip(mousePos.x, mousePos.y, `${axes[i]}: ${value.toFixed(1)}/100`)
        foundHover = true
      }
    })

    if (!foundHover) {
      hoveredIndex = -1
      hideTooltip()
    }

    drawChart()
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = -1
    hideTooltip()
    drawChart()
  })

  drawChart()
}

function createInteractiveLanguageChart(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement, data: GitHubAnalysisResult) {
  const ctx = canvas.getContext('2d')!
  if (!ctx) return
  
  const languages = data.summary?.top_languages?.slice(0, 8) || []
  if (languages.length === 0) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('No language data available', canvas.width / 2, canvas.height / 2)
    return
  }
  
  const totalLines = languages.reduce((sum, lang) => sum + (lang.lines || 0), 0)
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
  
  let hoveredIndex = -1
  let currentAngle = 0

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    currentAngle = 0
    
    languages.forEach((lang, i) => {
      const sliceAngle = (lang.lines / totalLines) * 2 * Math.PI
      const color = colors[i % colors.length]
      const isHovered = hoveredIndex === i
      
      // Draw slice with hover effect
      ctx.fillStyle = isHovered ? lightenColor(color, 20) : color
      ctx.beginPath()
      ctx.moveTo(200, 150)
      ctx.arc(200, 150, isHovered ? 125 : 120, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()
      
      // Add stroke for hovered slice
      if (isHovered) {
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.stroke()
      }
      
      // Draw label with hover effect
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = 200 + Math.cos(labelAngle) * (isHovered ? 145 : 140)
      const labelY = 150 + Math.sin(labelAngle) * (isHovered ? 145 : 140)
      
      ctx.fillStyle = '#374151'
      ctx.font = isHovered ? 'bold 12px sans-serif' : '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(lang.language, labelX, labelY)
      
      currentAngle += sliceAngle
    })
    
    // Draw legend
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'
    languages.forEach((lang, i) => {
      const y = 20 + i * 20
      const color = colors[i % colors.length]
      const isHovered = hoveredIndex === i
      
      ctx.fillStyle = isHovered ? lightenColor(color, 20) : color
      ctx.fillRect(20, y - 10, 15, 15)
      
      if (isHovered) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(20, y - 10, 15, 15)
      }
      
      ctx.fillStyle = '#374151'
      ctx.font = isHovered ? 'bold 12px sans-serif' : '12px sans-serif'
      ctx.fillText(`${lang.language}: ${((lang.lines / totalLines) * 100).toFixed(1)}%`, 40, y)
    })
  }

  function lightenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  function showTooltip(x: number, y: number, content: string) {
    tooltipDiv.textContent = content
    tooltipDiv.style.left = `${x + 10}px`
    tooltipDiv.style.top = `${y - 10}px`
    tooltipDiv.style.display = 'block'
    tooltipDiv.style.opacity = '1'
  }

  function hideTooltip() {
    tooltipDiv.style.opacity = '0'
    setTimeout(() => {
      tooltipDiv.style.display = 'none'
    }, 200)
  }

  function getMousePos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  function isPointInSlice(mouseX: number, mouseY: number, centerX: number, centerY: number, startAngle: number, endAngle: number, radius: number) {
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > radius) return false
    
    let angle = Math.atan2(dy, dx)
    if (angle < 0) angle += 2 * Math.PI
    
    // Normalize angles
    if (startAngle < 0) startAngle += 2 * Math.PI
    if (endAngle < 0) endAngle += 2 * Math.PI
    
    if (startAngle <= endAngle) {
      return angle >= startAngle && angle <= endAngle
    } else {
      return angle >= startAngle || angle <= endAngle
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const mousePos = getMousePos(e)
    let foundHover = false
    
    let angle = 0
    languages.forEach((lang, i) => {
      const sliceAngle = (lang.lines / totalLines) * 2 * Math.PI
      
      if (isPointInSlice(mousePos.x, mousePos.y, 200, 150, angle, angle + sliceAngle, 120)) {
        hoveredIndex = i
        showTooltip(mousePos.x, mousePos.y, `${lang.language}: ${lang.lines.toLocaleString()} lines (${((lang.lines / totalLines) * 100).toFixed(1)}%)`)
        foundHover = true
      }
      
      angle += sliceAngle
    })
    
    if (!foundHover) {
      hoveredIndex = -1
      hideTooltip()
    }
    
    drawChart()
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = -1
    hideTooltip()
    drawChart()
  })

  drawChart()
}

function createInteractiveQualityTrendsChart(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement, data: GitHubAnalysisResult) {
  const ctx = canvas.getContext('2d')!
  if (!ctx) return
  
  const repos = data.repositories?.slice(0, 10) || []
  if (repos.length === 0) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('No repository data available', canvas.width / 2, canvas.height / 2)
    return
  }
  
  const metrics = ['code_quality_score', 'security_score', 'maintainability_score']
  const colors = ['#3b82f6', '#10b981', '#f59e0b']
  const labels = ['Code Quality', 'Security', 'Maintainability']
  
  let hoveredPoint = { metric: -1, repo: -1 }

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    // Y-axis
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(50, 250)
    ctx.stroke()
    
    // X-axis
    ctx.beginPath()
    ctx.moveTo(50, 250)
    ctx.lineTo(350, 250)
    ctx.stroke()
    
    // Draw grid lines
    for (let i = 1; i <= 5; i++) {
      const y = 50 + (200 * i) / 5
      ctx.beginPath()
      ctx.moveTo(50, y)
      ctx.lineTo(350, y)
      ctx.stroke()
      
      // Y-axis labels
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${100 - (i - 1) * 20}`, 45, y + 3)
    }
    
    // Draw data lines
    metrics.forEach((metric, metricIndex) => {
      ctx.strokeStyle = colors[metricIndex]
      ctx.lineWidth = 2
      ctx.beginPath()
      
      repos.forEach((repo, repoIndex) => {
        const x = 50 + (300 * repoIndex) / (repos.length - 1)
        const y = 250 - (200 * (repo as any)[metric]) / 100
        
        if (repoIndex === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // Draw data points
      repos.forEach((repo, repoIndex) => {
        const x = 50 + (300 * repoIndex) / (repos.length - 1)
        const y = 250 - (200 * (repo as any)[metric]) / 100
        
        const isHovered = hoveredPoint.metric === metricIndex && hoveredPoint.repo === repoIndex
        
        ctx.fillStyle = isHovered ? darkenColor(colors[metricIndex], 20) : colors[metricIndex]
        ctx.beginPath()
        ctx.arc(x, y, isHovered ? 6 : 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Add glow effect for hovered point
        if (isHovered) {
          ctx.shadowColor = colors[metricIndex]
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, 2 * Math.PI)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })
    })
    
    // Draw legend
    labels.forEach((label, i) => {
      const y = 20 + i * 20
      ctx.fillStyle = colors[i]
      ctx.fillRect(20, y - 10, 15, 15)
      ctx.fillStyle = '#374151'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(label, 40, y)
    })
  }

  function darkenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1)
  }

  function showTooltip(x: number, y: number, content: string) {
    tooltipDiv.textContent = content
    tooltipDiv.style.left = `${x + 10}px`
    tooltipDiv.style.top = `${y - 10}px`
    tooltipDiv.style.display = 'block'
    tooltipDiv.style.opacity = '1'
  }

  function hideTooltip() {
    tooltipDiv.style.opacity = '0'
    setTimeout(() => {
      tooltipDiv.style.display = 'none'
    }, 200)
  }

  function getMousePos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  function isPointNear(mouseX: number, mouseY: number, pointX: number, pointY: number, threshold: number) {
    const distance = Math.sqrt((mouseX - pointX) ** 2 + (mouseY - pointY) ** 2)
    return distance <= threshold
  }

  canvas.addEventListener('mousemove', (e) => {
    const mousePos = getMousePos(e)
    let foundHover = false
    
    metrics.forEach((metric, metricIndex) => {
      repos.forEach((repo, repoIndex) => {
        const x = 50 + (300 * repoIndex) / (repos.length - 1)
        const y = 250 - (200 * (repo as any)[metric]) / 100
        
        if (isPointNear(mousePos.x, mousePos.y, x, y, 8)) {
          hoveredPoint = { metric: metricIndex, repo: repoIndex }
          showTooltip(mousePos.x, mousePos.y, `${labels[metricIndex]}: ${(repo as any)[metric].toFixed(1)}/100`)
          foundHover = true
        }
      })
    })
    
    if (!foundHover) {
      hoveredPoint = { metric: -1, repo: -1 }
      hideTooltip()
    }
    
    drawChart()
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredPoint = { metric: -1, repo: -1 }
    hideTooltip()
    drawChart()
  })

  drawChart()
}

function createInteractiveSkillsSunburstChart(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement, data: GitHubAnalysisResult) {
  const ctx = canvas.getContext('2d')!
  if (!ctx) return
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  
  // Group skills by category
  const skillCategories: Record<string, string[]> = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
    'Backend': ['Node.js', 'Python', 'Java', 'Go', 'Rust'],
    'Data': ['Data Science', 'Machine Learning', 'Analytics'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    'Mobile': ['React Native', 'Flutter', 'iOS', 'Android']
  }
  
  const topSkills = data.summary?.top_skills || []
  if (topSkills.length === 0) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('No skills data available', canvas.width / 2, canvas.height / 2)
    return
  }
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  let hoveredSegment = { category: -1, skill: -1 }
  
  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let currentAngle = 0
    
    Object.entries(skillCategories).forEach(([category, skills], categoryIndex) => {
      const categorySkills = skills.filter(skill => 
        topSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
      
      if (categorySkills.length === 0) return
      
      const sliceAngle = (categorySkills.length / topSkills.length) * 2 * Math.PI
      const color = colors[categoryIndex % colors.length]
      const isCategoryHovered = hoveredSegment.category === categoryIndex && hoveredSegment.skill === -1
      
      // Draw outer ring (category)
      ctx.fillStyle = isCategoryHovered ? lightenColor(color, 20) : color
      ctx.beginPath()
      ctx.arc(centerX, centerY, 120, currentAngle, currentAngle + sliceAngle)
      ctx.arc(centerX, centerY, 80, currentAngle + sliceAngle, currentAngle, true)
      ctx.closePath()
      ctx.fill()
      
      if (isCategoryHovered) {
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.stroke()
      }
      
      // Draw inner ring (skills)
      const skillAngle = sliceAngle / categorySkills.length
      categorySkills.forEach((skill, skillIndex) => {
        const skillStartAngle = currentAngle + skillIndex * skillAngle
        const skillEndAngle = skillStartAngle + skillAngle
        const isSkillHovered = hoveredSegment.category === categoryIndex && hoveredSegment.skill === skillIndex
        
        ctx.fillStyle = isSkillHovered ? lightenColor(color, 30) : color + '80'
        ctx.beginPath()
        ctx.arc(centerX, centerY, 80, skillStartAngle, skillEndAngle)
        ctx.arc(centerX, centerY, 40, skillEndAngle, skillStartAngle, true)
        ctx.closePath()
        ctx.fill()
        
        if (isSkillHovered) {
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })
      
      // Draw category label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * 100
      const labelY = centerY + Math.sin(labelAngle) * 100
      
      ctx.fillStyle = '#374151'
      ctx.font = isCategoryHovered ? 'bold 12px sans-serif' : '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(category, labelX, labelY)
      
      currentAngle += sliceAngle
    })
    
    // Draw center circle
    ctx.fillStyle = '#f9fafb'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = '#374151'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Skills', centerX, centerY + 5)
  }

  function lightenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  function showTooltip(x: number, y: number, content: string) {
    tooltipDiv.textContent = content
    tooltipDiv.style.left = `${x + 10}px`
    tooltipDiv.style.top = `${y - 10}px`
    tooltipDiv.style.display = 'block'
    tooltipDiv.style.opacity = '1'
  }

  function hideTooltip() {
    tooltipDiv.style.opacity = '0'
    setTimeout(() => {
      tooltipDiv.style.display = 'none'
    }, 200)
  }

  function getMousePos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  function isPointInArc(mouseX: number, mouseY: number, centerX: number, centerY: number, startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) {
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < innerRadius || distance > outerRadius) return false
    
    let angle = Math.atan2(dy, dx)
    if (angle < 0) angle += 2 * Math.PI
    
    // Normalize angles
    if (startAngle < 0) startAngle += 2 * Math.PI
    if (endAngle < 0) endAngle += 2 * Math.PI
    
    if (startAngle <= endAngle) {
      return angle >= startAngle && angle <= endAngle
    } else {
      return angle >= startAngle || angle <= endAngle
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const mousePos = getMousePos(e)
    let foundHover = false
    
    let currentAngle = 0
    Object.entries(skillCategories).forEach(([category, skills], categoryIndex) => {
      const categorySkills = skills.filter(skill => 
        topSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
      
      if (categorySkills.length === 0) return
      
      const sliceAngle = (categorySkills.length / topSkills.length) * 2 * Math.PI
      
      // Check category hover
      if (isPointInArc(mousePos.x, mousePos.y, centerX, centerY, currentAngle, currentAngle + sliceAngle, 80, 120)) {
        hoveredSegment = { category: categoryIndex, skill: -1 }
        showTooltip(mousePos.x, mousePos.y, `${category}: ${categorySkills.length} skills`)
        foundHover = true
      } else {
        // Check individual skill hover
        const skillAngle = sliceAngle / categorySkills.length
        categorySkills.forEach((skill, skillIndex) => {
          const skillStartAngle = currentAngle + skillIndex * skillAngle
          const skillEndAngle = skillStartAngle + skillAngle
          
          if (isPointInArc(mousePos.x, mousePos.y, centerX, centerY, skillStartAngle, skillEndAngle, 40, 80)) {
            hoveredSegment = { category: categoryIndex, skill: skillIndex }
            showTooltip(mousePos.x, mousePos.y, `${skill}`)
            foundHover = true
          }
        })
      }
      
      currentAngle += sliceAngle
    })
    
    if (!foundHover) {
      hoveredSegment = { category: -1, skill: -1 }
      hideTooltip()
    }
    
    drawChart()
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredSegment = { category: -1, skill: -1 }
    hideTooltip()
    drawChart()
  })

  drawChart()
}
