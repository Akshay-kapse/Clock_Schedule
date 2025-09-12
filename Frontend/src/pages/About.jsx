import {
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { TbTarget } from "react-icons/tb";
import { DiJavascript1, DiNodejsSmall } from "react-icons/di";
import { SiTailwindcss, SiExpress } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import ScrollAnimation from "../components/ScrollAnimation";
import { motion } from "framer-motion";

const AboutPage = () => {
  const features = [
    {
      icon: ClockIcon,
      title: "Time Management",
      description:
        "Advanced clock widgets with multiple themes and formats to help you stay aware of time.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CalendarDaysIcon,
      title: "Smart Scheduling",
      description:
        "Create and manage your daily schedules with intelligent time conflict detection.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TbTarget,
      title: "Goal Setting",
      description:
        "Set meaningful goals with deadlines and track your progress with detailed analytics.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: UserGroupIcon,
      title: "User-Friendly",
      description:
        "Intuitive interface designed for users of all technical backgrounds.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: "Project Launch",
      description:
        "ClockSchedule was born from the need for better time management tools.",
      icon: RocketLaunchIcon,
    },
    {
      year: "Q2 2024",
      title: "Core Features",
      description:
        "Implemented scheduling, goal setting, and time tracking functionality.",
      icon: LightBulbIcon,
    },
    {
      year: "Q3 2024",
      title: "UI/UX Enhancement",
      description:
        "Complete redesign with modern, responsive interface and dark theme support.",
      icon: StarIcon,
    },
    {
      year: "Future",
      title: "Advanced Analytics",
      description:
        "Planning to add AI-powered insights and productivity analytics.",
      icon: CheckCircleIcon,
    },
  ];

  const technologies = [
    { name: "React", logo: FaReact, isComponent: true },
    { name: "Node.js", logo: DiNodejsSmall, isComponent: true },
    { name: "MongoDB", logo: SiMongodb, isComponent: true },
    { name: "Tailwind CSS", logo: SiTailwindcss, isComponent: true },
    { name: "Express", logo: SiExpress, isComponent: true },
    { name: "JavaScript", logo: DiJavascript1, isComponent: true },
  ];

  return (
       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      {/* Background Gradient Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <LightBulbIcon className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                About ClockSchedule
              </h1>
            </motion.div>
            <motion.p
              className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Empowering individuals to master their time through intelligent
              scheduling, goal setting, and beautiful time management tools.
            </motion.p>
          </div>

          {/* Mission */}
          <motion.div
            className="glass-card rounded-3xl p-8 sm:p-12 mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              At ClockSchedule, we believe that effective time management is the
              foundation of success. Our mission is to provide intuitive,
              powerful tools that help individuals organize their time, achieve
              their goals, and maintain a healthy work-life balance. We combine
              beautiful design with practical functionality to create an
              experience that users love.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-card rounded-2xl p-6 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center z-10">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className={`glass-card rounded-2xl p-6 ml-16 md:ml-0 ${
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      } md:w-5/12`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Technologies */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-12">
              Built With Modern Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="glass-card rounded-2xl p-6 card-hover flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech.isComponent ? (
                    <tech.logo className="w-12 h-12 mb-3 text-white" />
                  ) : (
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="w-12 h-12 mb-3 filter brightness-0 invert"
                    />
                  )}
                  <p className="text-white font-medium text-sm">{tech.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card rounded-3xl p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Master Your Time?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their productivity
                with ClockSchedule. Start organizing your time and achieving
                your goals today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/goals"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Set Your Goals
                </motion.a>
                <motion.a
                  href="/schedule"
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Schedule
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default AboutPage;
